'use strict'

const { runHttpQuery } = require('apollo-server-core')
const { resolveGraphiQLString } = require('apollo-server-module-graphiql')
const fp = require('fastify-plugin')

const printSchemaOpts = {
  schema: {
    response: {
      200: {
        type: 'string'
      }
    }
  }
}

/**
 * @callback FastifyHandler
 * @param {fastify.Request} request
 * @param {fastify.Reply} reply
 */

/**
 * @param {object} options - @see GraphQLServerOptions
 * @return {FastifyHandler}
 */
function graphqlFastify (options) {
  if (!options) {
    throw new Error('Apollo server requires options.')
  }

  return async function (request, reply) {
    const { method } = request.req

    reply.type('application/json')

    const res = await runHttpQuery([request.req, reply], {
      method,
      options,
      query: method === 'POST' ? request.body : request.query
    })

    // Was not rendering correctly
    return JSON.parse(res)
  }
}

/**
 * @param {object} options - @see GraphiQLData
 * @return {FastifyHandler}
 */
function graphiqlFastify (options) {
  return function ({ query, req }, reply) {
    resolveGraphiQLString(query, options, req).then(
      graphiqlString => reply.type('text/html').code(200).send(graphiqlString),
      error => reply.send(error.message).code(500)
    )
  }
}

/**
 * @param {object} options - @see GraphQLServerOptions
 * @return {FastifyHandler}
 */
function printSchema ({ schema }) {
  return function (request, reply) {
    reply
      .type('text/plain')
      .code(200)
      .send(require('graphql').printSchema(schema))
  }
}

/**
 * @typedef FastifyApolloOptions
 * @type {object}
 * @prop {string} [prefix]
 * @prop {boolean} [printSchema]
 * @prop {object} graphql - @see GraphQLServerOptions
 * @prop {boolean | object} [graphiql] - @see GraphiQLData
 */

/**
 * @param {*} fastify
 * @param {FastifyApolloOptions} opts
 * @param {Function} next
 */
function fastifyApollo (fastify, opts, next) {
  if (!opts || !opts.graphql) {
    throw new Error('Graphql must have options')
  }

  // Do not want double backslashes on path
  if (opts.prefix === '/') {
    opts.prefix = undefined
  }

  if (opts.graphiql === true) {
    opts.graphiql = Object.assign({}, opts.graphiql, {
      endpointURL: opts.prefix || '/'
    })
  }

  fastify.register(
    function (instance, _, done) {
      instance.get('/', graphqlFastify(opts.graphql))
      instance.post('/', graphqlFastify(opts.graphql))

      if (opts.graphiql) {
        instance.get('/graphiql', graphiqlFastify(opts.graphiql))
      }

      if (opts.printSchema) {
        instance.get('/schema', printSchemaOpts, printSchema(opts.graphql))
      }

      done()
    },
    { prefix: opts.prefix }
  )

  next()
}

module.exports = fp(fastifyApollo)

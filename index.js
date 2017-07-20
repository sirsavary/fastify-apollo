'use strict'

const runHttpQuery = require('apollo-server-core').runHttpQuery
const resolveGraphiQLString = require('apollo-server-module-graphiql')
  .resolveGraphiQLString
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

  return function (request, reply) {
    const method = request.req.method

    runHttpQuery([request.req, reply], {
      method,
      options,
      query: method === 'POST' ? request.body : request.query
    }).then(
      function (res) {
        reply.type('application/graphql').send(res)
      },
      function (err) {
        if (err.name === 'HttpQueryError') {
          if (err.headers) {
            Object.keys(err.headers).forEach(function (header) {
              reply.header(header, err.headers[header])
            })
          }
        }

        if (!err.statusCode) {
          reply.code(500)
        } else {
          reply.code(err.statusCode)
        }

        reply.type('application/graphql').send(err.message)
      }
    )
  }
}

/**
 * @param {object} options - @see GraphiQLData
 * @return {FastifyHandler}
 */
function graphiqlFastify (options) {
  return function (request, reply) {
    resolveGraphiQLString(request.query, options, request.req).then(
      function (graphiqlString) {
        reply.type('text/html').code(200).send(graphiqlString)
      },
      function (err) {
        reply.code(500).send(err)
      }
    )
  }
}

/**
 * @param {object} options - @see GraphQLServerOptions
 * @return {FastifyHandler}
 */
function printSchema (options) {
  return function (request, reply) {
    reply
      .type('text/plain')
      .code(200)
      .send(require('graphql').printSchema(options.schema))
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

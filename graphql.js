const runHttpQuery = require('apollo-server-core').runHttpQuery
const graphqlSchema = require('./schemas').graphql
const printSchema = require('./schemas').printSchema

function apolloGraphqlFastify (options) {
  if (!options) {
    throw new Error('Apollo server requires options.')
  }

  return function (request, reply) {
    const method = request.req.method

    runHttpQuery([request, reply], {
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

module.exports = function (fastify, opts, next) {
  if (!opts) {
    throw new Error('GraphQL must have options')
  }

  fastify.route({
    method: ['GET', 'POST'],
    path: '/',
    schema: graphqlSchema,
    handler: apolloGraphqlFastify(opts)
  })

  if (opts.printSchema) {
    fastify.get('/schema', printSchema, function (request, reply) {
      reply
        .type('text/plain')
        .code(200)
        .send(require('graphql').printSchema(opts.schema))
    })
  }

  next()
}

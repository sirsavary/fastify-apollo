const resolveGraphiQLString = require('apollo-server-module-graphiql').resolveGraphiQLString
const graphiqlSchema = require('./schemas').graphiql

function apolloGraphiqlFastify (options) {
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

module.exports = function (fastify, opts, next) {
  if (opts && opts.endpointURL && typeof opts.endpointURL === 'string') {
    fastify.get('/', graphiqlSchema, apolloGraphiqlFastify(opts))
  } else {
    next(new Error(`GraphiQL needs 'endpointURL' got ${opts.endpointURL}`))
  }

  next()
}

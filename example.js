'use strict'

const fastify = require('fastify')()
const { makeExecutableSchema } = require('graphql-tools')
const { graphqlFastify, graphiqlFastify } = require('./')

const typeDefs = `
type Query {
    hello: String,
    hellos: [String]
}
`

const resolvers = {
  Query: {
    hello: () => 'world',
    hellos: () => ['hola', 'hello', 'aloha']
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

fastify
  .register(graphqlFastify, {
    schema,
    printSchema: true
  })
  .register(graphiqlFastify, {
    endpointURL: '/',
    prefix: '/graphiql'
  })

fastify.register(require('./'), {
  graphql: {
    schema
  },
  graphiql: {
    endpointURL: '/',
    prefix: '/graphiql'
  },
  prefix: '/v2'
}, err => {
  if (err) {
    throw err
  }
})

fastify.listen(8000, function (err) {
  if (err) {
    throw err
  }

  for (const route of fastify) {
    console.log(route)
  }

  console.log(`listening on ${fastify.server.address().port}`)
})

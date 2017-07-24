'use strict'

const fastify = require('fastify')()
const { makeExecutableSchema } = require('graphql-tools')

const typeDefs = `
type Query {
    hello: String,
    hellos: [String]
}
`

const resolvers = {
  Query: {
    hello: () => 'world',
    hellos: () => [
      'hola',
      'hello',
      'aloha'
    ]
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

fastify.register(require('./index'), {
  prefix: '/api',
  graphql: () => ({ schema }),
  graphiql: true,
  printSchema: true
})

fastify.listen(8000, function (err) {
  if (err) {
    throw err
  }

  for (let route of fastify) {
    console.log(route)
  }

  console.log(`listening on ${fastify.server.address().port}`)
})

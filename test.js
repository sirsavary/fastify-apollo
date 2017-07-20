'use strict'

const test = require('tap').test
const fastify = require('fastify')
const { makeExecutableSchema } = require('graphql-tools')
const request = require('request')

const typeDefs = `
type Query {
    hello: String
}
`

const resolvers = {
  Query: {
    hello: () => 'world'
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

test('GET /graphql', t => {
  t.plan(3)

  const server = fastify()

  server.register(require('./index'), {
    graphql: { schema }
  })

  server.listen(0, err => {
    t.error(err)

    request.get(
      'http://localhost:' + server.server.address().port,
      function (err, response, body) {
        t.error(err)
        t.strictEqual(response.statusCode, 500)
        server.close()
      }
    )
  })
})

test('POST /graphql', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), {
    graphql: { schema }
  })

  server.listen(0, err => {
    t.error(err)

    request.post(
      'http://localhost:' + server.server.address().port,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          query: '{hello}'
        },
        json: true
      },
      function (err, response, body) {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.deepEqual(body.data, { hello: 'world' })
        server.close()
      }
    )
  })
})

test('GET /graphiql (options as boolean)', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), {
    graphql: { schema },
    graphiql: true
  })

  server.listen(0, err => {
    t.error(err)

    request.get(
      'http://localhost:' + server.server.address().port + '/graphiql',
      function (err, response, body) {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(response.headers['content-type'], 'text/html')
        server.close()
      }
    )
  })
})

test('GET /graphiql (options as object)', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), {
    graphql: { schema },
    graphiql: {
      endpointURL: '/'
    }
  })

  server.listen(0, err => {
    t.error(err)

    request.get(
      'http://localhost:' + server.server.address().port + '/graphiql',
      function (err, response, body) {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(response.headers['content-type'], 'text/html')
        server.close()
      }
    )
  })
})

test('GET /scheam', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), {
    graphql: { schema },
    printSchema: true
  })

  server.listen(0, err => {
    t.error(err)

    request.get(
      'http://localhost:' + server.server.address().port + '/schema',
      function (err, response, body) {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(response.headers['content-type'], 'text/plain')
        server.close()
      }
    )
  })
})

test('prefix', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), {
    prefix: '/api',
    graphql: { schema },
    graphiql: true,
    printSchema: true
  })

  server.ready(function (err) {
    t.error(err)

    for (let route of server) {
      const path = Object.keys(route)[0]
      t.match(path, /^\/api/)
    }

    server.close()
  })
})

'use strict'

const test = require('tap').test
const fastify = require('fastify')
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema
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
const opts = {
  graphql: {
    schema
  },
  graphiql: {
    endpointURL: '/',
    prefix: '/graphiql'
  }
}

test('GET /graphql', t => {
  t.plan(3)

  const server = fastify()

  server.register(require('./index'), opts)

  server.listen(0, err => {
    t.error(err)

    request.get(
      'http://localhost:' + server.server.address().port,
      function (err, response, body) {
        t.error(err)
        t.strictEqual(response.statusCode, 400)
        server.close()
      }
    )
  })
})

test('POST /graphql', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), opts)

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

test('POST /graphql (error)', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), opts)

  server.listen(0, err => {
    t.error(err)

    request.post(
      'http://localhost:' + server.server.address().port,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          query: '{goodbye}'
        },
        json: true
      },
      function (err, response, body) {
        t.error(err)
        t.strictEqual(response.statusCode, 400)
        t.deepEqual(body.errors[0].message, 'Cannot query field "goodbye" on type "Query".')
        server.close()
      }
    )
  })
})

test('GET /graphiql (options as boolean)', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), opts)

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

  server.register(require('./index'), opts)

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

test('GET /schema', t => {
  t.plan(4)

  const server = fastify()

  server.register(require('./index'), Object.assign({}, opts, {
    printSchema: true
  }))

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
  t.plan(3)

  const server = fastify()

  server.register(require('./index'), Object.assign({}, {
    prefix: '/api',
    printSchema: true
  }))

  server.ready(function (err) {
    t.error(err)

    for (let route of server) {
      const path = Object.keys(route)[0]
      t.match(path, /^\/api/)
    }

    server.close()
  })
})

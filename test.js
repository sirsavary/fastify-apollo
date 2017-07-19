"use strict";

const t = require("tap");
const test = t.test;
const fastify = require("fastify");
const { makeExecutableSchema } = require("graphql-tools");
const request = require("request");

const typeDefs = `
type Query {
    hello: String
}
`;

const resolvers = {
  Query: {
    hello: () => "world"
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

test("GET /graphql", t => {
  t.plan(3);

  const server = fastify();

  server.register(require("./index"), {
    prefix: "/",
    graphql: { schema }
  });

  server.listen(0, err => {
    t.error(err);

    request(
      {
        method: "GET",
        uri: "http://localhost:" + server.server.address().port
      },
      (err, response, body) => {
        t.error(err);
        t.strictEqual(response.statusCode, 500);
        server.close();
      }
    );
  });
});

test("POST /graphql", t => {
  t.plan(4);

  const server = fastify();

  server.register(require("./index"), {
    prefix: "/",
    graphql: { schema }
  });

  server.listen(0, err => {
    t.error(err);

    request.post(
      "http://localhost:" + server.server.address().port,
      {
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            query: "{hello}"
        },
        json: true
      },
      (err, response, body) => {
        t.error(err);
        t.strictEqual(response.statusCode, 200);
        t.deepEqual(body.data, {hello: "world"});
        server.close();
      }
    );
  });
});

test("GET /graphiql", t => {
  t.plan(2);

  const server = fastify();

  server.register(require("./index"), {
    prefix: "/",
    graphql: { schema, graphiql: true },
  });

  server.listen(0, err => {
    t.error(err);

    request(
      {
        method: "GET",
        uri: "http://localhost:" + server.server.address().port + "/graphiql"
      },
      (err, response, body) => {
        t.error(err);
        // t.strictEqual(response.statusCode, 200);
        // t.strictEqual(response.headers["content-type"], "text/html");
        server.close();
      }
    );
  });
});
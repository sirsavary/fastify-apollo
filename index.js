"use strict";

const { runHttpQuery } = require("apollo-server-core");
const { resolveGraphiQLString } = require("apollo-server-module-graphiql");
const fp = require("fastify-plugin");

/**
 * @callback FastifyHandler
 * @param {*} request
 * @param {*} response
 * @return {Promise<*>}
 */

/**
 * @param {object} options
 * @return {FastifyHandler}
 */
function fastifyGraphqlHandler(options) {
  if (!options) {
    throw new Error("Apollo server requires options.");
  }

  return async (request, response) => {
    const { method } = request.req;

    response.type("application/json");

    const res = await runHttpQuery([request.req, response], {
      method,
      options,
      query: method === "POST" ? request.body : request.query
    });

    // Was not rendering correctly
    return JSON.parse(res);
  };
}

/**
 * @param {object} options
 * @return {FastifyHandler}
 */
function graphiqlFastify(options) {
  return ({ query, req }, response) => {
    resolveGraphiQLString(query, options, req).then(
      graphiqlString => response.type("text/html").code(200).send(graphiqlString),
      error => response.send(error.message).code(500)
    );
  };
}

/**
 * @param {*} fastify
 * @param {*} opts
 * @param {*} next
 */
function fastifyGraphql(fastify, opts, next) {
  if (!opts || !opts.graphql) {
    throw new Error("Graphql must have options");
  }

  if (!opts.prefix) {
    opts.prefix = "/";
  }

  if (opts.graphql.graphiql && !opts.graphiql) {
    Object.assign({}, opts.graphiql, { endpointURL: opts.prefix });
  }

  fastify.get(opts.prefix, fastifyGraphqlHandler(opts.graphql));
  fastify.post(opts.prefix, fastifyGraphqlHandler(opts.graphql));

  if (opts.graphiql || opts.graphql.graphiql) {
    fastify.get(opts.prefix + "/graphiql", graphiqlFastify(opts.graphiql));
  }

  if (opts.printSchema) {
    fastify.get(
      opts.prefix + "/schema",
      { schema: { response: { 200: { type: "string" } } } },
      (req, reply) => {
        reply
          .type("text/plain")
          .code(200)
          .send(require("graphql").printSchema(opts.graphql.schema));
      }
    );
  }

  next();
}

module.exports = fp(fastifyGraphql);

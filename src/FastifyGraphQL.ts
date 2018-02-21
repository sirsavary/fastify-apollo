import FastifyPlugin from 'fastify-plugin';

import GraphQLPlugin from "./GraphQLPlugin";
import GraphiQLPlugin from "./GraphiQLPlugin";
import {FastifyInstance, Middleware} from "fastify";

// prevent fastify-plugin from stripping our prefix
const fp = (plugin: Middleware<any, any, any>) =>
  FastifyPlugin(function (fastify: FastifyInstance<any, any, any>, opts: object, next: Function) {
    fastify.register(plugin, opts);
    next()
  }, {
    fastify: '>=0.40.0',
  });

const graphqlFastify = fp(GraphQLPlugin);
const graphiqlFastify = fp(GraphiQLPlugin);

export { graphqlFastify, graphiqlFastify };

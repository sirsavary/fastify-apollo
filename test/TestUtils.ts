import * as Fastify from 'fastify';
import { makeExecutableSchema } from 'graphql-tools';
import {graphiqlFastify, graphqlFastify} from "../src/FastifyGraphQL";
import {GraphQLSchema} from "graphql";

export function createGQLSchema(): GraphQLSchema {
  const typeDefs = `
    type Query {
        hello: String
    }
  `;

  const resolvers = {
    Query: {
      hello: () => 'world',
    },
  };

  return makeExecutableSchema({ typeDefs, resolvers });
}

export function createFastifyApp(schema: GraphQLSchema) {
  const app = Fastify();

  app.register(graphqlFastify, { 
    prefix: '/graphql', 
    graphql: {
      schema: schema,
    },
  });
  
  app.register(graphiqlFastify, {
    prefix: '/graphiql',
    graphiql: {
      endpointURL: '/graphql',
    }
  });

  return app;
}
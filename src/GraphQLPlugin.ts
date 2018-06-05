import { runHttpQuery, GraphQLOptions }                  from 'apollo-server-core';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, OutgoingMessage, Server }      from 'http';

function GraphQLPlugin(fastify: FastifyInstance<Server, IncomingMessage, OutgoingMessage>, pluginOptions: { prefix: string, graphql: Function | GraphQLOptions }, next: (err?: Error) => void) {
  if (!pluginOptions) throw new Error('Fastify GraphQL requires options!');
  else if (!pluginOptions.prefix) throw new Error('Fastify GraphQL requires `prefix` to be part of passed options!');
  else if (!pluginOptions.graphql) throw new Error('Fastify GraphQL requires `graphql` to be part of passed options!');

  const handler = async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<OutgoingMessage>) => {
    try {
      let method = request.req.method;
      const gqlResponse = await runHttpQuery([request, reply], {
        method : method,
        options: pluginOptions.graphql,
        query  : method === 'POST' ? request.body : request.query,
      });
      
      // bypass Fastify's response layer, so we can avoid having to
      // parse the serialized gqlResponse due to Fastify's internal 
      // JSON serializer seeing our Content-Type header and assuming 
      // the response payload is unserialized
      reply.sent = true
      reply.res.setHeader('Content-Type', 'application/json');
      reply.res.end(gqlResponse);
    } catch (error) {
      if ('HttpQueryError' !== error.name) {
        throw error;
      }

      if (error.headers) {
        Object.keys(error.headers).forEach(header => {
          reply.header(header, error.headers[header]);
        });
      }

      reply.code(error.statusCode);
      // error.message is actually a stringified GQL response, see
      // comment @ line 19 for why we bypass Fastify's response layer
      if (error.isGraphQLError) {
        reply.sent = true
        reply.res.setHeader('Content-Type', 'application/json');
        reply.res.end(error.message);
      } else {
        reply.send(error.message);
      }
    }
  };
  
  fastify.get('/', handler);
  fastify.post('/', handler);
  
  //TODO determine if this is really the best way to have Fastify not 404 on an invalid HTTP method
  fastify.setNotFoundHandler((request, reply) => {
    if (request.req.method !== 'POST' && request.req.method !== 'POST') {
      reply.code(405);
      reply.header('allow', ['GET', 'POST']);
    } else {
      reply.code(404);
    }
    reply.send();
  });
  
  next();
}

export default GraphQLPlugin;

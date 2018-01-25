import {runHttpQuery} from "apollo-server-core";
import GraphQLServerOptions from "apollo-server-core/dist/graphqlOptions";
import {FastifyReply, FastifyRequest} from "fastify";
import {IncomingMessage, OutgoingMessage} from "http";

function GraphQLPlugin(fastify: any, pluginOptions: { prefix: string, graphql: Function | GraphQLServerOptions }, next: any) {
  if (!pluginOptions) throw new Error('Fastify GraphQL requires options!');
  else if (!pluginOptions.prefix) throw new Error('Fastify GraphQL requires `prefix` to be part of passed options!');
  else if (!pluginOptions.graphql) throw new Error('Fastify GraphQL requires `graphql` to be part of passed options!');

  const handler = function (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<OutgoingMessage>) {
    let method = request.req.method;
    
    runHttpQuery([request, reply], {
      method: method,
      options: pluginOptions.graphql,
      query: method === 'POST' ? request.body : request.query,
    }).then((gqlResponse) => {
      reply.type('application/graphql').send(gqlResponse);
    }).catch((error) => {
      // pass through GraphQL error headers
      if (error.name === 'HttpQueryError') {
        if (error.headers) {
          Object.keys(error.headers).forEach((header) => {
            reply.header(header, error.headers[header]);
          });
        }
      }

      // use status code or default to 500
      reply.code(error.statusCode ? error.statusCode : 500);

      reply.type('application/graphql').send(error.message);
    });
  };

  fastify.route({
    method: ['GET', 'POST'],
    path: '/',
    handler: handler,
  });

  next();
}

export default GraphQLPlugin;

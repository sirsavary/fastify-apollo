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
      //TODO find out if we can make this more efficient
      // we have to parse the already serialized JSON from runHTTPQuery
      // because fastify sees our json content-type header and assumes
      // that the payload is an unserialized object. Unfortunately there
      // is no way for us to override the JSON serializer, so for now
      // we must parse the string and let fastify do the serialization
      reply.type('application/json').send(JSON.parse(gqlResponse));
    }).catch((error) => {
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
      // comment @ line 19 for why we need to parse it before sending
      reply.send(JSON.parse(error.message));
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

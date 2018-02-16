import URL                                               from 'url';
import { GraphiQLData, resolveGraphiQLString }           from 'apollo-server-module-graphiql';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, OutgoingMessage, Server }      from 'http';

function GraphiQLPlugin(fastify: FastifyInstance<Server, IncomingMessage, OutgoingMessage>, options: { prefix: string, graphiql: GraphiQLData | Function }, next: (err?: Error) => void) {
  options = Object.assign({
    prefix  : '/graphiql',
    graphiql: {
      endpointURL: '/graphql',
    },
  }, options);

  const handler = async (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<OutgoingMessage>) => {
    try {
      const query          = request.req.url && URL.parse(request.req.url, true).query;
      const graphiqlString = await resolveGraphiQLString(query, options.graphiql, [request, reply]);
      reply.type('text/html').send(graphiqlString);
    } catch (error) {
      reply.code(500);
      reply.send(error.message);
    }
  };

  fastify.get('/', handler);

  next();
}

export default GraphiQLPlugin;
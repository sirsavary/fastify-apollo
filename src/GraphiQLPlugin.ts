// GraphiQL Plugin
import * as GraphiQL from "apollo-server-module-graphiql";
import * as URL from "url";
import {GraphiQLData} from "apollo-server-module-graphiql";

function GraphiQLPlugin(fastify: any, options: { prefix: string, graphiql: GraphiQLData | Function }, next: any) {
  options = Object.assign({
    prefix: '/graphiql',
    graphiql: {
      endpointURL: '/graphql',
    },
  }, options);

  const handler = (request: any, reply: any) => {
    const query = request.url && URL.parse(request.url, true).query;
    GraphiQL.resolveGraphiQLString(query, options.graphiql, request)
      .then((graphiqlString: string) => {
        reply.type('text/html').send(graphiqlString);
      })
      .catch((error) => {
        // use status code or default to 500
        reply.code(error.statusCode ? error.statusCode : 500);

        reply.type('text/html').send(error.message);
      });
  };

  fastify.get('/', handler);

  next();
}

export default GraphiQLPlugin;
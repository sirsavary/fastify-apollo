import Fastify                                  from 'fastify';
import * as http                                from 'http';
import { graphiqlFastify, graphqlFastify }      from '../src/FastifyGraphQL';
import testSuite, { CreateAppOptions, schema, } from './apollo-server-integration-testsuite';

async function createFastifyApp(options: CreateAppOptions = {}): Promise<any> {
  const app = Fastify();

  options.graphqlOptions = options.graphqlOptions || { schema: schema };

  app.register(graphqlFastify, {
    prefix : '/graphql',
    graphql: options.graphqlOptions,
  });

  if (options.graphiqlOptions) {
    app.register(graphiqlFastify, {
      prefix  : '/graphiql',
      graphiql: options.graphiqlOptions,
    });
  }

  await app.listen(0);
  return app.server;
}

async function destroyFastifyApp(app: http.Server): Promise<void> {
  await app.close();
}

describe('integration:Fastify', () => {
  testSuite(createFastifyApp, destroyFastifyApp);
});
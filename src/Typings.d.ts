declare module 'fastify-plugin';

// chai-graphql definitions
declare module 'chai-graphql';
declare namespace Chai {
  interface Assertion {
    graphQL: Equal
    graphQLError(): void;
  }
}
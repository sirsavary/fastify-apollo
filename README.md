# fastify-graphql
[![Travis](https://img.shields.io/travis/sirsavary/fastify-graphql.svg)](https://travis-ci.org/sirsavary/fastify-graphql)
[![npm](https://img.shields.io/npm/v/fastify-graphql.svg)](https://www.npmjs.com/package/fastify-graphql)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A plugin for [Fastify](https://github.com/fastify/fastify) that adds GraphQL and GraphiQL support.

This project was forked from [fastify-apollo](https://github.com/coopnd/fastify-apollo) as it is no longer being maintained fast enough to keep pace with the rapid changes happening in the GraphQL ecosystem.

## Installation
```bash
npm install --save fastify-graphql graphql
```

or

```bash
yarn add fastify-graphql graphql
```

## Usage
```js
const Fastify = require('fastify');
const app = Fastify();

const {graphiqlFastify, graphqlFastify} = require('fastify-graphql');
app.register(graphqlFastify, { 
  prefix: '/graphql', 
  graphql: {
    schema: your_graphql_schema,
  },
});
app.register(graphiqlFastify, {
  prefix: '/graphiql',
  graphiql: {
    endpointURL: '/graphql',
  }
});
```

## Configuration

Both plugins need to be given a prefix, under which they will mount.

GraphQL settings extends [GraphQLServerOptions](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-core/src/graphqlOptions.ts#L9-L37)

GraphiQL settings extends [GraphiQLData](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-module-graphiql/src/renderGraphiQL.ts#L9-L33)

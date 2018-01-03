# [fastify](https://github.com/fastify/fastify)-[apollo](https://github.com/apollographql/apollo-server)

## Install
```bash
npm install --save fastify fastify-apollo graphql
```

## Register plugin
```js
fastify.register(require("fastify-apollo"), {
    graphql: { schema, rootValue },
    graphiql: {
      endpointURL: "/"
    },
    prefix: "/api",
    printSchema: true // `/api/schema`
});
```

## GraphQL
Extends [GraphQLServerOptions](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-core/src/graphqlOptions.ts#L7-L16) from Apollo.

```js
const { graphqlFastify } = require("fastify-apollo");

fastify.register(graphqlFastify, {
  schema
})
```

## GraphiQL
Uses [`resolveGraphiQLString`](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-module-graphiql/src/resolveGraphiQLString.ts#L44-L49) under the hood. Extends [GraphiQLData](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-module-graphiql/src/renderGraphiQL.ts#L9-L29).

```js
const { graphiqlFastify } = require("fastify-apollo");

fastify.register(graphiqlFastify, {
  endpointURL: "/",
  prefix: "/graphiql"
})
```

###

<div>
  <img src="https://travis-ci.org/coopnd/fastify-apollo.svg?branch=master">

  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
  </a>
</div>

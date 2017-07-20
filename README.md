> [Apollo](https://github.com/apollographql/apollo-server) for fastify.

###

fasity-apollo
---

<p align="center">
    <img src="https://travis-ci.org/coopnd/fastify-apollo.svg?branch=master">
</p>

## Register plugin
```js
fastify.register(require("fastify-apollo"), {
    graphql: { schema },
    graphiql: true
});
```

## Endpoints
Path                  | Renders
----------------------|--------
`/{prefix}`           | GraphQL endpoint
`/{prefix}/graphiql`  | GraphiQL
`/prefix/schema`      | GraphQL schema

## Options

### Prefix
Defaults to "/".
```js
options.prefix = "/api"
```

### GraphQL
Extends [GraphQLServerOptions](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-core/src/graphqlOptions.ts#L4-L28) from Apollo.
```js
options.graphql = { schema }
```

### GraphiQL
Uses [`resolveGraphiQLString`](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-module-graphiql/src/resolveGraphiQLString.ts#L44-L49) under the hood. Extends [GraphiQLData](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-server-module-graphiql/src/renderGraphiQL.ts#L9-L29).

If no options are supplied for GraphiQL or it is truthy its `endpointURL` will default to the prefix.
```js
options.graphiql = true
```

### PrintSchema
Prints graphql schema...obviously requires graphql.
```js
options.printSchema = true
```
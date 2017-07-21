> Run an Apollo Server for Fastify.

---

<h1 align="center">
    <a href="https://github.com/fastity/fastity">fastity</a>-<a href="https://github.com/apollographql/apollo-server">apollo</a>
</h1>

<p align="center">
    <img src="https://travis-ci.org/coopnd/fastify-apollo.svg?branch=master">
    <a href="https://standardjs.com">
        <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
    </a>
</p>

---

## Install
```bash
npm install --save fastity-apollo graphql
```

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
`/{prefix}/schema`    | GraphQL schema

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

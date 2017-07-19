<p align="center">
    <img src="https://travis-ci.org/coopnd/fastify-apollo.svg?branch=master">
</p>

> [Apollo](https://github.com/apollographql/apollo-server) for fastify.

```js
fastify.register(require("fastify-apollo"), {
    graphql: { schema, graphiql: true }
});
```
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');

const PORT = process.env.PORT || 4000;

const app = express();

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  formatError(err) {
    return {
      message: err.message,
      code: err.originalError && err.originalError.code,
      locations: err.locations,
      path: err.path,
    };
  },
});

server.applyMiddleware({
  app,
});

app.listen({ port: PORT }, () =>
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);

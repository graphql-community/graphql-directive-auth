const { gql } = require('apollo-server-express');
const isAuthenticated = require('../src/index');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = gql`
  type Query {
    me: String @isAuthenticated
    you: String
  }
`;

const resolvers = {
  Query: {
    me: () => Math.random() + 1,
    you: () => Math.random() - 1,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: isAuthenticated('123'),
  },
});

module.exports = schema;

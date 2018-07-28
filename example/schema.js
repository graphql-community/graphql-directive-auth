const { gql } = require('apollo-server-express');
const { isAuthenticated, hasRole } = require('../src/index');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = gql`
  type Query {
    me: String @isAuthenticated
    you: String @hasRole(role: "USER")
    together: String @hasRole(role: "MALINA")
  }
`;

const resolvers = {
  Query: {
    me: () => `me-${Math.random()}`,
    you: () => `you-${Math.random()}`,
    together: () => `together-${Math.random()}`,
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: isAuthenticated('123'),
    hasRole: hasRole('123'),
  },
});

module.exports = schema;

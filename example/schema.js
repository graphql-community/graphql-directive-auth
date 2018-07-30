const { gql } = require('apollo-server-express');
const { isAuthenticated, hasRole } = require('../src/index');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    isAdmin: Boolean
  }

  type Query {
    me: User @isAuthenticated
    you: String @hasRole(role: "USER")
    together: String @hasRole(role: "MALINA")
  }
`;

const resolvers = {
  Query: {
    me: () => ({
      id: 'uniqKey1',
      username: 'Bond',
      isAdmin: true,
    }),
    you: () => `you are ${Math.random() * 100}`,
    together: () => Math.random() * 10,
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

const { gql } = require('apollo-server-express');
const { isAuthenticated, hasRole } = require('../src/index');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    isAdmin: Boolean
  }

  type Custom {
    public: String
    private: String @hasRole(role: "MALINA")
  }

  type Query {
    me: User @isAuthenticated
    you: String @hasRole(role: "USER")
    together: String @hasRole(role: "MALINA")
    field: Custom
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
    field: () => ({ public: 'public_exists', private: 'private_exists' }),
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

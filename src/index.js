const { SchemaDirectiveVisitor } = require('graphql-tools');
const {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
} = require('graphql');
const jwt = require('jsonwebtoken');
const { AuthError } = require('./utils');

module.exports = appSecret =>
  class isAuthenticated extends SchemaDirectiveVisitor {
    static getDirectiveDeclaration(directiveName = 'isAuthenticated') {
      return new GraphQLDirective({
        name: directiveName,
        locations: [DirectiveLocation.FIELD_DEFINITION],
      });
    }

    visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field;

      field.resolve = async (root, args, context, info) => {
        const authorization = context.req.get('Authorization');

        if (authorization) {
          const token = authorization.replace('Bearer ', '');
          const user = jwt.verify(token, appSecret);

          return resolve.apply(this, root, args, { ...context, user }, info);
        }

        throw new AuthError('Not authorized!', 401);
      };
    }
  };

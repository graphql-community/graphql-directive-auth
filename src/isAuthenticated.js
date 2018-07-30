const { SchemaDirectiveVisitor } = require('graphql-tools');
const {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
} = require('graphql');
const { authenticate } = require('./utils');

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
        const user = authenticate(context, appSecret);

        return resolve.call(this, root, args, { ...context, user }, info);
      };
    }
  };

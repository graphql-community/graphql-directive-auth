const { SchemaDirectiveVisitor } = require('graphql-tools');
const {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
  GraphQLString,
} = require('graphql');
const { authenticate } = require('./utils');

module.exports = appSecret =>
  class HasRole extends SchemaDirectiveVisitor {
    static getDirectiveDeclaration(directiveName = 'hasRole') {
      return new GraphQLDirective({
        name: directiveName,
        locations: [DirectiveLocation.FIELD_DEFINITION],
        args: {
          role: { type: GraphQLString },
        },
      });
    }

    checkRole(userRole, requiredRole) {
      return userRole === requiredRole;
    }

    visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field;

      field.resolve = async (root, args, context, info) => {
        const user = authenticate(context, appSecret);
        const role = this.args.role;

        if (!user.role) {
          throw new Error(`Invalid token payload!`);
        }

        const hasRole = this.checkRole(user.role, role);

        if (!hasRole) {
          throw new Error(
            `Must have role: ${role}, you have role: ${user.role}`
          );
        }

        return resolve.call(this, root, args, { ...context, user }, info);
      };
    }
  };

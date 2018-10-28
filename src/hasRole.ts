import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
  GraphQLString,
} from 'graphql';
import { authenticate } from './utils';

export default (authenticate: (ctx: any) => any) =>
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

    checkRole(role: any, requiredRoles: any) {
      return requiredRoles
        .split(',')
        .map((role: any) => role.trim().toLowerCase())
        .includes(role.toLowerCase());
    }

    visitFieldDefinition(field: any) {
      const { resolve = defaultFieldResolver } = field;

      const hasResolveFn = field.resolve !== undefined;

      field.resolve = async (root: any, args: any, context: any, info: any) => {
        const auth = authenticate(context);
        const role = this.args.role;

        if (!auth.role) {
          throw new Error(`Invalid token payload!`);
        }

        const hasRole = this.checkRole(auth.role, role);

        if (!hasRole && !hasResolveFn) {
          return null;
        } else if (!hasRole) {
          throw new Error(
            `Must have role: ${role}, you have role: ${auth.role}`
          );
        }

        return resolve.call(this, root, args, { ...context, auth }, info);
      };
    }
  };

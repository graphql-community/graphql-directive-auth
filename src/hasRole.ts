import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
  GraphQLString,
} from 'graphql';
import { authFunc, checkRoleFunc, CheckRole } from './index';

export default (authenticate: authFunc, checkRoleFunc?: checkRoleFunc) =>
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

    checkRole(auth: any, requiredRoles: any) {
      const userRole = auth.role;

      if (!userRole) {
        throw new Error(`Invalid token payload, missing role property inside!`);
      }

      const hasNeededRole = requiredRoles
        .split(',')
        .map((role: any) => role.trim().toLowerCase())
        .includes(userRole.toLowerCase());

      if (!hasNeededRole) {
        throw new Error(
          `Must have role: ${requiredRoles}, you have role: ${auth.role}`
        );
      }
    }

    visitFieldDefinition(field: any) {
      const { resolve = defaultFieldResolver } = field;

      const hasResolveFn = field.resolve !== undefined;

      field.resolve = async (root: any, args: any, context: any, info: any) => {
        const auth = authenticate(context);
        const allowedRoles = this.args.role;

        const checkRole = checkRoleFunc || this.checkRole;

        try {
          checkRole(auth, allowedRoles);
        } catch (error) {
          if (!hasResolveFn) {
            return null;
          }

          throw error;
        }

        return resolve.call(this, root, args, { ...context, auth }, info);
      };
    }
  };

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

    checkRole(context: any, requiredRoles: any) {
      const userRole = context.auth.role;

      if (!userRole) {
        throw new Error(`Invalid token payload, missing role property inside!`);
      }

      const hasNeededRole = requiredRoles
        .split(',')
        .map((role: any) => role.trim().toLowerCase())
        .includes(userRole.toLowerCase());

      if (!hasNeededRole) {
        throw new Error(
          `Must have role: ${requiredRoles}, you have role: ${userRole}`
        );
      }
    }

    visitFieldDefinition(field: any) {
      const { resolve = defaultFieldResolver } = field;

      const hasResolveFn = field.resolve !== undefined;

      field.resolve = (root: any, args: any, context: any, info: any) => {
        const auth = authenticate(context);
        const allowedRoles = this.args.role;

        const checkRole = checkRoleFunc || this.checkRole;

        const newContext = { ...context, auth };

        try {
          checkRole(newContext, allowedRoles);
        } catch (error) {
          if (!hasResolveFn) {
            return null;
          }

          throw error;
        }

        return resolve.call(this, root, args, { ...newContext }, info);
      };
    }
  };

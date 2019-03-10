import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
  GraphQLString,
} from 'graphql';
import {authFunc, checkRoleFunc, CheckRole, checkRole} from './index';

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

    visitFieldDefinition(field: any) {
      const { resolve = defaultFieldResolver } = field;

      const hasResolveFn = field.resolve !== undefined;

      field.resolve = (root: any, args: any, context: any, info: any) => {
        const auth = authenticate(context);
        const allowedRoles = this.args.role;

        const checkRoleFn = checkRoleFunc || checkRole;

        const newContext = { ...context, auth };

        try {
          checkRoleFn(newContext, allowedRoles);
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

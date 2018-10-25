import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
  GraphQLString,
} from 'graphql';
import { authenticate } from './utils';

export default (appSecret: string) =>
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

    checkRole(userRole: any, requiredRoles: any) {
      return requiredRoles
        .split(',')
        .map((role: any) => role.trim().toLowerCase())
        .includes(userRole.toLowerCase());
    }

    visitFieldDefinition(field: any) {
      const { resolve = defaultFieldResolver } = field;

      const hasResolveFn = field.resolve !== undefined;

      field.resolve = async (root: any, args: any, context: any, info: any) => {
        const user: any = authenticate(context, appSecret);
        const role = this.args.role;

        if (!user.role) {
          throw new Error(`Invalid token payload!`);
        }

        const hasRole = this.checkRole(user.role, role);

        if (!hasRole && !hasResolveFn) {
          return null;
        } else if (!hasRole) {
          throw new Error(
            `Must have role: ${role}, you have role: ${user.role}`
          );
        }

        return resolve.call(this, root, args, { ...context, user }, info);
      };
    }
  };

import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
} from 'graphql';

export default (authenticate: (ctx: any) => any) =>
  class isAuthenticated extends SchemaDirectiveVisitor {
    static getDirectiveDeclaration(directiveName = 'isAuthenticated') {
      return new GraphQLDirective({
        name: directiveName,
        locations: [DirectiveLocation.FIELD_DEFINITION],
      });
    }

    visitFieldDefinition(field: any) {
      const { resolve = defaultFieldResolver } = field;

      field.resolve = (root: any, args: any, context: any, info: any) => {
        const auth = authenticate(context);

        return resolve.call(this, root, args, { ...context, auth }, info);
      };
    }
  };

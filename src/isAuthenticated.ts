import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  DirectiveLocation,
  GraphQLDirective,
  defaultFieldResolver,
} from 'graphql';
import { authenticate } from './utils';

export default (appSecret: string) =>
  class isAuthenticated extends SchemaDirectiveVisitor {
    static getDirectiveDeclaration(directiveName = 'isAuthenticated') {
      return new GraphQLDirective({
        name: directiveName,
        locations: [DirectiveLocation.FIELD_DEFINITION],
      });
    }

    visitFieldDefinition(field: any) {
      const { resolve = defaultFieldResolver } = field;

      field.resolve = async (root: any, args: any, context: any, info: any) => {
        const user = authenticate(context, appSecret);

        return resolve.call(this, root, args, { ...context, user }, info);
      };
    }
  };

import { authFunc, checkRoleFunc } from '../index';

declare module 'graphql-directive-auth' {
  interface AuthDirective {
    hasRole: any;
    isAuthenticated: any;
  }

  interface Args {
    authenticateFunc?: authFunc;
    checkRoleFunc?: checkRoleFunc;
  }

  interface DirectivesInterface {
    AuthDirective: AuthDirective;
    authenticateFunc?: authFunc;
    checkRoleFunc?: checkRoleFunc;
  }

  export default function(args?: Args): DirectivesInterface;
}

import { authFunc, checkRoleFunc } from '../index';

declare module 'graphql-directive-auth' {
  interface AuthDirective {
    hasRole: any;
    isAuthenticated: any;
  }

  export default function(
    authFun: authFunc,
    checkRoleFunc?: checkRoleFunc
  ): AuthDirective;
}

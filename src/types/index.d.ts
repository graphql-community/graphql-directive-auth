declare module 'graphql-directive-auth' {
  interface AuthDirective {
    hasRole: any;
    isAuthenticated: any;
  }

  type authFunc = (any: any) => any;

  export default function(authFun: authFunc): AuthDirective;
}

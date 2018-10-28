declare module 'graphql-directive-auth' {
  export function hasRole(secret: string): any;
  export function isAuthenticated(secret: string): any;
}

import '@babel/polyfill';
import isAuthenticated from './isAuthenticated';
import hasRole from './hasRole';
import { authenticate } from './utils';

// TODO: Add more correct type here
export interface CheckRole {
  userRole: any;
}
export type authFunc = (any: any) => any;
export type checkRoleFunc = (auth: any, allowedRoles: any) => void;

export default (authenticateFunc?: authFunc, checkRoleFunc?: checkRoleFunc) => {
  const auth = authenticateFunc ? authenticate : authenticate;

  return {
    isAuthenticated: isAuthenticated(auth),
    hasRole: hasRole(auth, checkRoleFunc),
  };
};

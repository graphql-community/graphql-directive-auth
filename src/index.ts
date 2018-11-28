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

export interface Args {
  authenticateFunc?: authFunc;
  checkRoleFunc?: checkRoleFunc;
}

export default (args: Args = {}) => {
  const auth = args.authenticateFunc || authenticate;

  return {
    isAuthenticated: isAuthenticated(auth),
    hasRole: hasRole(auth, args.checkRoleFunc),
  };
};

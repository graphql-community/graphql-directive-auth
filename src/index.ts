import '@babel/polyfill';
import isAuthenticated from './isAuthenticated';
import hasRole from './hasRole';
import { authenticate, checkRole } from './utils';

export interface CheckRole {
  userRole: any;
}
export type authFunc = (any: any) => any;
export type checkRoleFunc = (auth: any, allowedRoles: any) => void;

export interface Args {
  authenticateFunc?: authFunc;
  checkRoleFunc?: checkRoleFunc;
}

const AuthDirective = (args: Args = {}) => {
    const auth = args.authenticateFunc || authenticate;

    return {
        isAuthenticated: isAuthenticated(auth),
        hasRole: hasRole(auth, args.checkRoleFunc),
    } as any;
}
export { AuthDirective, authenticate, checkRole }

import isAuthenticated from './isAuthenticated';
import hasRole from './hasRole';
import { authenticate } from './utils';

// TODO: Add more correct type
type authFunc = (any: any) => any;

export default (authenticateFunc: authFunc = authenticate) => ({
  isAuthenticated: isAuthenticated(authenticateFunc),
  hasRole: hasRole(authenticateFunc),
});

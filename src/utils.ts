import jwt from 'jsonwebtoken';

export class AuthError extends Error {
  code: number;

  constructor(message = 'Error occured', code = 400) {
    super(message);

    this.code = code;
  }
}

export const authenticate = (context: any) => {
  const authorization = context.req.get('Authorization');

  if (authorization) {
    const token = authorization.replace('Bearer ', '');

    try {
      const secret = process.env.APP_SECRET;

      if (!secret) {
        throw new Error(
          'Secret not provided, please provide `APP_SECRET` with your token'
        );
      }

      return jwt.verify(token, secret);
    } catch (e) {
      throw new AuthError('Invalid token!', 401);
    }
  }

  throw new AuthError('Not authorized!', 401);
};

export const checkRole = (context: any, requiredRoles: any) => {
    const userRole = context.auth.role;

    if (!userRole) {
        throw new Error(`Invalid token payload, missing role property inside!`);
    }

    const hasNeededRole = requiredRoles
        .split(',')
        .map((role: any) => role.trim().toLowerCase())
        .includes(userRole.toLowerCase());

    if (!hasNeededRole) {
        throw new Error(
            `Must have role: ${requiredRoles}, you have role: ${userRole}`
        );
    }
}

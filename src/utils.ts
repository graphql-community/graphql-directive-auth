import jwt from 'jsonwebtoken';

export class AuthError extends Error {
  code: number;

  constructor(message = 'Error occured', code = 400) {
    super(message);

    this.code = code;
  }
}

export const authenticate = (context: any, secret: string) => {
  const authorization = context.req.get('Authorization');

  if (authorization) {
    const token = authorization.replace('Bearer ', '');

    try {
      return jwt.verify(token, secret);
    } catch (e) {
      throw new AuthError('Invalid token!', 401);
    }
  }

  throw new AuthError('Not authorized!', 401);
};

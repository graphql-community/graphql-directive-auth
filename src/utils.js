const jwt = require('jsonwebtoken');

class AuthError extends Error {
  constructor(message = 'Error occured', code = 400) {
    super(message);

    this.code = code;
  }
}

const authenticate = (context, secret) => {
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

module.exports.AuthError = AuthError;
module.exports.authenticate = authenticate;

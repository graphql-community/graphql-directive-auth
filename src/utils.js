class AuthError extends Error {
  constructor(message = 'Error occured', code = 400) {
    super(message);

    this.code = code;
  }
}

module.exports.AuthError = AuthError;

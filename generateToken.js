/* eslint-disable no-console */
const jwt = require('jsonwebtoken');

const SECRET = process.env.secret || '123';

(function generateToken() {
  const token = jwt.sign(
    {
      id: 'user_id',
      role: 'USER',
    },
    SECRET
  );

  console.log(`\n${token}\n`);
})();

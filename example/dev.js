process.env.APP_SECRET = '123';

require('@babel/register')({ extensions: ['.js', '.ts'] });
require('./index.ts');

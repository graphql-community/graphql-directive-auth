require('@babel/polyfill');

require('@babel/register')({ extensions: ['.js', '.ts'] });

process.env.APP_SECRET = '123';

require('./index.ts');

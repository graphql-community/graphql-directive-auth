module.exports = {
  presets: ['@babel/env', '@babel/preset-typescript'],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
  env: {
    testing: {
      presets: [['@babel/env', { modules: false }], '@babel/preset-typescript'],
    },
  },
};

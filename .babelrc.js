module.exports = {
  presets: ['@babel/env', '@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-transform-regenerator',
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
  env: {
    testing: {
      presets: [['@babel/env', { modules: false }], '@babel/preset-typescript'],
    },
  },
};

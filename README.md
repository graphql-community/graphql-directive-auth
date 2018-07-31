# graphql-directive-auth

[![Version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![PRs Welcome][prs-badge]][prs]
[![MIT License][license-badge]][build]

# Introduction

> TODO

# Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#Usage)
- [Parameters](#parameters)
- [Contributing](#contributing)
- [LICENSE](#license)

# Installation

```
yarn add graphql-directive-auth
```

# Usage

- set `appSecret` parameter with your secret to decode JWT token
  example:

```js
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: isAuthenticated('your_secret_token'),
    hasRole: hasRole('your_secret_token'),
  },
});
```

## Example queries:

> TODO

# Directive Parameters

- '@isAuthenticated' - check if user is authenticated
- '@hasRole(role: "user, admin")' - check if user is authenticated

> TODO

> if you use [`graphql-import`](https://github.com/prismagraphql/graphql-import) then you need to add this definition on top of the schema:

```graphql
directive @isAuthenticated on FIELD | FIELD_DEFINITION
directive @hasRole(role: String) on FIELD | FIELD_DEFINITION
```

## Contributing

I would love to see your contribution. ❤️

For local development (and testing), all you have to do is to run `yarn` and then `yarn dev`. This will start the Apollo server and you are ready to contribute :tada:

Run yarn test (try `--watch` flag) for unit tests (we are using Jest)

# LICENSE

The MIT License (MIT) 2018 - Luke Czyszczonik - <mailto:lukasz.czyszczonik@gmail.com>

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/graphql-community/graphql-directive-auth.svg?style=flat-square
[build]: https://travis-ci.org/graphql-community/graphql-directive-auth
[coverage-badge]: https://img.shields.io/codecov/c/github/graphql-community/graphql-directive-auth.svg?style=flat-square
[coverage]: https://codecov.io/github/graphql-community/graphql-directive-auth
[version-badge]: https://img.shields.io/npm/v/graphql-directive-auth.svg?style=flat-square
[package]: https://www.npmjs.com/package/graphql-directive-auth
[downloads-badge]: https://img.shields.io/npm/dm/graphql-directive-auth.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/graphql-directive-auth
[license-badge]: https://img.shields.io/npm/l/graphql-directive-auth.svg?style=flat-square
[license]: https://github.com/graphql-community/graphql-directive-auth/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/graphql-community/graphql-directive-auth/blob/master/CODE_OF_CONDUCT.md

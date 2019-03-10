# graphql-directive-auth

[![Version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![PRs Welcome][prs-badge]][prs]
[![MIT License][license-badge]][build]

# Introduction

The `graphql-directive-auth` was created to help with common authentication tasks that is faced in almost every API.

# Table of Contents

- [graphql-directive-auth](#graphql-directive-auth)
- [Introduction](#introduction)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [Default](#default)
    - [What `default` means, and what I **need to do**?](#what-default-means-and-what-i-need-to-do)
    - [Example:](#example)
  - [Custom behaviour of authentication functions](#custom-behaviour-of-authentication-functions)
  - [Custom check role function](#custom-check-role-function)
    - [How to create your own function](#how-to-create-your-own-function)
- [Directive Parameters](#directive-parameters)
  - [Contributing](#contributing)
- [LICENSE](#license)

# Installation

```
yarn add graphql-directive-auth
```

# Usage

We are able to use directives in two different way:

## Default

To use the default directive behaviour, you need to set `APP_SECRET` environment variable, and that's all.

### What `default` means, and what do I **need to do**?

- `@isAuthenticated` - Just after you set environment variables, you need to have a valid JWT token and send it by `Authorization` in the HTTP headers. That's all, the directive will check your token and throw an error if the token is invalid or expired.
- `@hasRole` - Checks roles of an authenticated user. To use it correctly, inside your JWT token you should have the `role` property with the correct role. If the user role doesn't match with the provided role, then directive will throw an error.

> `@hasRole` before checking role is doing authentication to get roles from JWT token.

### Example:

```js
import { AuthDirective } from 'graphql-directive-auth';
// or
const AuthDirective = require('graphql-directive-auth').AuthDirective;

// set environment variable, but in better way ;)
process.env.APP_SECRET = 'your_secret_key';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    // to use @hasRole and @isAuthenticated directives
    ...AuthDirective(),
    // custom name for @isAuthenticated
    auth: AuthDirective().isAuthenticated,
    // custom name for @hasRole
    role: AuthDirective().hasRole,
  },
});
```

## Custom behaviour of authentication functions

If you need custom Authentication you can pass your authentication function to the main `AuthDirective` functions. Your authentication function should return an object which will be available via `context.auth`.

Authentication function signature:

```js
context => {
  // your logic here

  // you should return an object
  // this object will be passed inside your resolver
  // it is available inside context via auth property
  return {
    user: {
      id: 'your_user_id',
    },
  };
};
```

usage:

```js
import { AuthDirective } from 'graphql-directive-auth';
// or
const AuthDirectives = require('graphql-directive-auth').AuthDirective;

const customAuth = AuthDirectives({
  authenticateFunc: authenticateCustomFunc,
  checkRoleFunc: checkRoleCustomFunc
});

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    // to use @hasRole and @isAuthenticated directives
    ...customAuth,
    // custom name for @isAuthenticated
    auth: customAuth().isAuthenticated,
    // custom name for @hasRole
    role: customAuth().hasRole,
  },
```

resolver:

```js
export default {
  Query: {
    me() (root, args, ctx){
      const userId = ctx.auth.user.id; // your_user_id
    },
  },
};
```

## Custom check role function

Same as with the authenticate function, you can add your own logic to checking roles.

### How to create your own function

- Function accepts two parameters, one is the context and the second is the value from the directive
- To reject an access to the particular field, you need to throw an Error that will be caught by the directive and returned if required.
- Function doesn't need to return anything special

# Directive Parameters

- '@isAuthenticated' - checks if user is authenticated
- '@hasRole(role: "user, admin")' - checks if user is authenticated and has the specified roles

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

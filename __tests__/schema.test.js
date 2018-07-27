const { graphql } = require('graphql');
const directive = require('../src/index');
const MockExpressRequest = require('mock-express-request');
const schema = require('../example/schema');

test('getDirectiveDeclaration should be defined', () => {
  expect(directive('123').getDirectiveDeclaration()).toMatchSnapshot();
});

test('if call resolver if Authorization header is set to correct value', () =>
  graphql(
    schema,
    `
      query {
        me
      }
    `,
    {},
    {
      req: new MockExpressRequest({
        headers: {
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbG8iOjEyMywiaWF0IjoxNTMyNzI3MDMzfQ.nSGh5q9YXZd-pWYagOxD2f-9hdNPw08e4MnKASgn4wY',
        },
      }),
    }
  ).then(response => {
    expect(response.data.me).toBeTruthy();
  }));

test('if throw an Error if Authorization header is not set to correct value', () =>
  graphql(
    schema,
    `
      query {
        me
      }
    `,
    {},
    {
      req: new MockExpressRequest({ headers: {} }),
    }
  ).then(response => {
    expect(response.errors[0].message).toEqual('Not authorized!');
    expect(response.data.me).toBeNull();
  }));

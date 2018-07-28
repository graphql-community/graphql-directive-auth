const { graphql } = require('graphql');
const { hasRole } = require('../src/index');
const MockExpressRequest = require('mock-express-request');
const schema = require('../example/schema');

test('getDirectiveDeclaration should be defined', () => {
  expect(hasRole('123').getDirectiveDeclaration()).toMatchSnapshot();
});

test('if throw error if no role inside token payload', () =>
  graphql(
    schema,
    `
      query {
        you
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
    expect(response.errors[0].message).toEqual('Invalid token payload!');
    expect(response.data.you).toBeNull();
    expect(response).toMatchSnapshot({
      data: {
        you: null,
      },
      errors: expect.anything(),
    });
  }));

test('if role are correct', () =>
  graphql(
    schema,
    `
      query {
        you
      }
    `,
    {},
    {
      req: new MockExpressRequest({
        headers: {
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfaWQiLCJyb2xlIjpbIlVTRVIiLCJNQU5BR0VSIiwiQURNSU4iXSwiaWF0IjoxNTMyNzgzOTQ5fQ.GrDx9CAhf2XX9BdBEcMstKWIAonV_TYkTiCml67f9tg',
        },
      }),
    }
  ).then(response => {
    expect(response.errors).toBeUndefined();
    expect(response).toMatchSnapshot({
      data: {
        you: expect.any(String),
      },
    });
  }));

test('if throw an Error when user does not have correct roles', () =>
  graphql(
    schema,
    `
      query {
        together
      }
    `,
    {},
    {
      req: new MockExpressRequest({
        headers: {
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfaWQiLCJyb2xlIjpbIlVTRVIiLCJNQU5BR0VSIiwiQURNSU4iXSwiaWF0IjoxNTMyNzgzOTQ5fQ.GrDx9CAhf2XX9BdBEcMstKWIAonV_TYkTiCml67f9tg',
        },
      }),
    }
  ).then(response => {
    expect(response.errors[0].message).toEqual(
      'Must have role: MALINA, you have role: USER, MANAGER, ADMIN'
    );
    expect(response.data.together).toBeNull();
    expect(response).toMatchSnapshot({
      data: {
        together: null,
      },
      errors: expect.anything(),
    });
  }));

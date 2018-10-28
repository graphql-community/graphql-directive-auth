import { graphql } from 'graphql';
import MockExpressRequest from 'mock-express-request';
import AuthDirective from '../src/index';
import schema from '../example/schema';

beforeAll(() => {
  process.env.APP_SECRET = '123';
});

test('getDirectiveDeclaration should be defined', () => {
  expect(
    AuthDirective().isAuthenticated.getDirectiveDeclaration()
  ).toMatchSnapshot();
});

test('if call resolver if Authorization header is set to correct value', () =>
  graphql(
    schema,
    `
      query {
        me {
          id
          username
          isAdmin
        }
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
    expect(response).toMatchSnapshot({
      data: {
        me: {
          id: expect.any(String),
          username: expect.any(String),
          isAdmin: expect.any(Boolean),
        },
      },
    });
  }));

test('if throw an Error if Authorization header is not set to correct value', () =>
  graphql(
    schema,
    `
      query {
        me {
          id
          username
          isAdmin
        }
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

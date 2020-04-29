import { graphql } from 'graphql';
import MockExpressRequest from 'mock-express-request';
import { AuthDirective } from '../src/index';
import schema from '../example/schema';

beforeAll(() => {
  process.env.APP_SECRET = '123';
});

test('getDirectiveDeclaration should be defined', () => {
  expect(AuthDirective().hasRole.getDirectiveDeclaration().toConfig()).toMatchSnapshot();
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
    expect(response.errors[0].message).toEqual(
      'Invalid token payload, missing role property inside!'
    );
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
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfaWQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTUzMzA0ODk5N30.DISf4XuHkVo7YPXjY2VQWXgZge-c_ejLzsiBql2mXIs',
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
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfaWQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTUzMzA0ODk5N30.DISf4XuHkVo7YPXjY2VQWXgZge-c_ejLzsiBql2mXIs',
        },
      }),
    }
  ).then(response => {
    expect(response.errors[0].message).toEqual(
      'Must have role: MALINA, you have role: USER'
    );
    expect(response.data.together).toBeNull();
    expect(response).toMatchSnapshot({
      data: {
        together: null,
      },
      errors: expect.anything(),
    });
  }));

test('if return null for a field when does not have permissions', () =>
  graphql(
    schema,
    `
      query {
        field {
          public
          private
        }
      }
    `,
    {},
    {
      req: new MockExpressRequest({
        headers: {
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfaWQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTUzMzA0ODk5N30.DISf4XuHkVo7YPXjY2VQWXgZge-c_ejLzsiBql2mXIs',
        },
      }),
    }
  ).then(response => {
    expect(response).toMatchSnapshot({
      data: {
        field: {
          public: 'public_exists',
          private: null,
        },
      },
    });
  }));

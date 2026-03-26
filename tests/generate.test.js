import { test, mock } from 'node:test';
import assert from 'node:assert';

// Mock the 'replicate' module so that we can import the handler
mock.module('replicate', {
  defaultExport: class Replicate {
    constructor() {}
    run() {
      return Promise.resolve(['output-url']);
    }
  }
});

// Using a dynamic import so the mock takes effect
const handler = (await import('../pages/api/generate.js')).default;

test('handler rejects non-POST requests', async (t) => {
  const methods = ['GET', 'PUT', 'DELETE', 'PATCH'];

  for (const method of methods) {
    await t.test(`rejects ${method} request`, async () => {
      const req = {
        method,
      };

      let statusCode;
      let responseBody;

      const res = {
        status: (code) => {
          statusCode = code;
          return {
            json: (body) => {
              responseBody = body;
            },
          };
        },
      };

      await handler(req, res);

      assert.strictEqual(statusCode, 405, `Expected 405 for ${method}`);
      assert.deepStrictEqual(responseBody, { error: 'Method not allowed' }, `Expected error message for ${method}`);
    });
  }
});

test('handler accepts POST request', async () => {
  const req = {
    method: 'POST',
    body: {
      imageUrl: 'test-url',
      style: 'modern',
    },
  };

  let statusCode;
  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: () => {},
      };
    },
  };

  await handler(req, res);

  assert.notStrictEqual(statusCode, 405, 'Should not return 405 for POST request');
});

import { test, mock } from 'node:test';
import assert from 'node:assert';
import handler from '../pages/api/generate.js?test=1';

test('generate handler - rejects missing imageUrl', async () => {
  const req = { method: 'POST', body: {} };
  let statusCode = 0;
  let jsonResponse = null;
  const res = {
    status: (code) => { statusCode = code; return res; },
    json: (data) => { jsonResponse = data; }
  };

  await handler(req, res);
  assert.strictEqual(statusCode, 400);
  assert.deepStrictEqual(jsonResponse, { error: 'Invalid image URL' });
});

test('generate handler - rejects invalid URL format', async () => {
  const req = { method: 'POST', body: { imageUrl: 'not-a-url' } };
  let statusCode = 0;
  let jsonResponse = null;
  const res = {
    status: (code) => { statusCode = code; return res; },
    json: (data) => { jsonResponse = data; }
  };

  await handler(req, res);
  assert.strictEqual(statusCode, 400);
  assert.deepStrictEqual(jsonResponse, { error: 'Invalid image URL format' });
});

test('generate handler - rejects unauthorized domain without env var', async () => {
  // when NEXT_PUBLIC_SUPABASE_URL is not set, it should fallback to *.supabase.co
  const originalEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;

  const req = { method: 'POST', body: { imageUrl: 'https://evil.com/image.jpg' } };
  let statusCode = 0;
  let jsonResponse = null;
  const res = {
    status: (code) => { statusCode = code; return res; },
    json: (data) => { jsonResponse = data; }
  };

  await handler(req, res);
  assert.strictEqual(statusCode, 403);
  assert.deepStrictEqual(jsonResponse, { error: 'Unauthorized image source' });

  if (originalEnv) process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv;
});

test('generate handler - rejects unauthorized domain with env var', async () => {
  const originalEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mysupabase.supabase.co';

  const req = { method: 'POST', body: { imageUrl: 'https://evil.com/image.jpg' } };
  let statusCode = 0;
  let jsonResponse = null;
  const res = {
    status: (code) => { statusCode = code; return res; },
    json: (data) => { jsonResponse = data; }
  };

  await handler(req, res);
  assert.strictEqual(statusCode, 403);
  assert.deepStrictEqual(jsonResponse, { error: 'Unauthorized image source' });

  if (originalEnv) process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv;
});

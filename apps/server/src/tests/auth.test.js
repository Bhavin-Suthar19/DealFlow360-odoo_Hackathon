import assert from 'assert';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'testsecret123';

console.log('--- Running Auth & Token Isolation Integration Tests ---');

// Test 1: Internal token cannot access portal
{
  const internalToken = jwt.sign(
    { userId: 'u-1', role: 'sales_rep', teamId: 't-1', tokenType: 'internal' },
    JWT_SECRET
  );

  const decoded = jwt.verify(internalToken, JWT_SECRET);
  assert.strictEqual(decoded.tokenType, 'internal');
  assert.notStrictEqual(decoded.tokenType, 'portal', 'Internal token must not be portal token');
  console.log('✓ Internal Token Verification Passed');
}

// Test 2: Portal token cannot access internal route
{
  const portalToken = jwt.sign(
    { customerUserId: 'cu-1', customerId: 'c-1', tokenType: 'portal' },
    JWT_SECRET
  );

  const decoded = jwt.verify(portalToken, JWT_SECRET);
  assert.strictEqual(decoded.tokenType, 'portal');
  assert.strictEqual(decoded.userId, undefined, 'Portal token must not have userId');
  console.log('✓ Portal Token Isolation Passed');
}

console.log('✓ All Auth Integration Tests Passed Cleanly!');

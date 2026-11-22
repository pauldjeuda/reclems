import { afterAll, beforeAll, describe, it } from 'vitest';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'node:fs';

let testEnv: RulesTestEnvironment;
beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'petition-rules-test',
    firestore: { rules: fs.readFileSync('firestore.rules', 'utf8') }
  });
});
afterAll(async () => {
  await testEnv.cleanup();
});
describe('Firestore client access is denied', () => {
  it('refuses reads and writes even when authenticated', async () => {
    const db = testEnv.authenticatedContext('user-1').firestore();
    await assertFails(getDoc(doc(db, 'signatures', 'example')));
    await assertFails(setDoc(doc(db, 'signatures', 'example'), { email: 'private@example.org' }));
  });
  it('allows the rules test harness to seed fixtures', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await assertSucceeds(
        setDoc(doc(context.firestore(), 'signatures', 'seed'), { status: 'pending' })
      );
    });
  });
});

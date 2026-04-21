/**
 * Run once to:
 *  1. Set Irg2N5ijaaSl3J3TtDyljkdnzNy1 as admin
 *  2. Demote all other users with role=admin to role=client
 *
 * Usage:
 *   node scripts/set-super-admin.mjs
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS or firebase-admin service account.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const SUPER_ADMIN_UID = 'Irg2N5ijaaSl3J3TtDyljkdnzNy1';

// Try to load service account from env or local file
let credential;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const sa = JSON.parse(readFileSync(resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS), 'utf8'));
    credential = cert(sa);
  } else {
    // Try local service account file
    const sa = JSON.parse(readFileSync(resolve('./serviceAccount.json'), 'utf8'));
    credential = cert(sa);
  }
} catch (e) {
  console.error('❌ Could not load service account credentials.');
  console.error('   Set GOOGLE_APPLICATION_CREDENTIALS env var or place serviceAccount.json in project root.');
  process.exit(1);
}

if (!getApps().length) initializeApp({ credential });
const db = getFirestore();

async function run() {
  const usersSnap = await db.collection('users').get();
  const batch = db.batch();
  let demoted = 0;

  for (const docSnap of usersSnap.docs) {
    const data = docSnap.data();
    if (docSnap.id === SUPER_ADMIN_UID) {
      // Ensure super-admin has correct role
      batch.set(docSnap.ref, { role: 'admin', blocked: false }, { merge: true });
      console.log(`✅ Super-admin confirmed: ${SUPER_ADMIN_UID}`);
    } else if (data.role === 'admin') {
      // Demote all other admins to client
      batch.update(docSnap.ref, { role: 'client' });
      console.log(`⬇️  Demoted: ${docSnap.id} (${data.email || 'no email'})`);
      demoted++;
    }
  }

  await batch.commit();
  console.log(`\n✅ Done. Demoted ${demoted} admin(s) to client.`);
}

run().catch(err => { console.error(err); process.exit(1); });

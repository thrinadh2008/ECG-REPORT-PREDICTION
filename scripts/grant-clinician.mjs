import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const uid = process.argv[2];
const projectId = process.env.GOOGLE_CLOUD_PROJECT;

if (!projectId || !uid || process.argv.length !== 3) {
  console.error(
    "Usage: set GOOGLE_CLOUD_PROJECT to your Firebase project ID, then run npm run grant:clinician -- <user-uid>",
  );
  process.exitCode = 1;
} else {
  try {
    initializeApp({
      credential: applicationDefault(),
      projectId,
    });

    const auth = getAuth();
    const user = await auth.getUser(uid);
    await auth.setCustomUserClaims(uid, {
      ...user.customClaims,
      clinician: true,
    });
    console.log(`Clinician access granted to ${user.email || uid}. Ask them to sign out and back in.`);
  } catch (error) {
    console.error(`Could not grant clinician access: ${error.message}`);
    process.exitCode = 1;
  }
}

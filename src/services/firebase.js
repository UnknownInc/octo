import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.DBURL,
});


export default admin;
export const auth = admin.auth;
export const db = admin.firestore; 


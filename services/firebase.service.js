const admin = require('firebase-admin');

const serviceAccount = require('../env/firebaseConfig.json');

admin.initializeApp({

  credential:
  admin.credential.cert(
    serviceAccount
  )

});

const firestore = admin.firestore();

module.exports = firestore;
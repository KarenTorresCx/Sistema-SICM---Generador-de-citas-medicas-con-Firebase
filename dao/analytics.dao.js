const firestore = require('../services/firebase.service');

const saveEvent = async (eventData) => {
  try {
    await firestore.collection('analytics_events').add({

        ...eventData,

        created_at:
          new Date()

      });

    console.log(
      'Evento guardado en Firebase'
    );

  }

  catch (error) {

    console.error(
      'Firebase error:',
      error
    );

  }

};

module.exports = {
  saveEvent
};
const firestore = require('../services/firebase.service');
const db = require('../services/mysql.service');

const executeETL = async (req, res) => {
  try {

    const snapshot =
    await firestore
    .collection('analytics_events')
    .get();

    let imported = 0;

    for (const doc of snapshot.docs) {

      const data = doc.data();

      console.log(data);

      const appointment_id =
      data.appointment_id || null;

      const patient_id =
      data.patient_id || null;

      const doctor_id =
      data.doctor_id || null;

      const event_type =
      data.event_type || null;

      const device =
      data.device || null;

      const note =
      data.note || null;

      const event_timestamp =
      data.timestamp
        ? data.timestamp.toDate()
        : new Date();

      await db.query(

        `INSERT INTO analytics_events
        (
          appointment_id,
          patient_id,
          doctor_id,
          event_type,
          device,
          note,
          event_timestamp
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)`,

        [

          appointment_id,

          patient_id,

          doctor_id,

          event_type,

          device,

          note,

          event_timestamp

        ]

      );

      imported++;

    }

    res.json({

      message:
      'ETL ejecutado correctamente',

      imported

    });

  }

  catch (e) {

    console.log(
      'ERROR ETL'
    );

    console.error(e);

    res.status(500).json({

      error:
      e.message

    });

  }

};

module.exports = {
  executeETL
};
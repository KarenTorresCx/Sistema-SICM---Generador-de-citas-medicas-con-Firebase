const express = require("express");

const patientsRoutes = require("./routes/patients.routes");
const doctorsRoutes = require("./routes/doctors.routes");
const appointmentsRoutes = require("./routes/appointments.routes");
const specialtyRoutes = require("./routes/specialties.routes");
const usersRoutes = require('./routes/users.routes');
const etlRoutes = require('./routes/etl.routes');

const PORT = 5000;
const api = express();

api.use(express.json());
api.use(express.static("public"));

api.use("/patients", patientsRoutes);
api.use("/doctors", doctorsRoutes);
api.use("/appointments", appointmentsRoutes);
api.use('/specialties', specialtyRoutes);
api.use('/users', usersRoutes);
api.use('/etl', etlRoutes);


api.listen(PORT, () => {
    console.log("Servidor corriendo en http://localhost:5000");

});

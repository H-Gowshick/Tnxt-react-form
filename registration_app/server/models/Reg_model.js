// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthday: String,
  gender: String,
  email: String,
  phoneNumber: String, // Make sure this field is defined in your schema
  subject: String,
  image: String,
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;

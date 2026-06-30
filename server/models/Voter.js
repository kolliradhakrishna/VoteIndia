const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const voterSchema = new mongoose.Schema(
  {
    voterIdNumber: {
      type: String,
      unique: true,
      default: () => 'VTR-' + uuidv4().split('-')[0].toUpperCase(),
    },
    // Step 1 — Personal Info
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    nationality: { type: String, required: true, default: 'Indian' },
    // Step 2 — Contact Info
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    // Step 3 — ID Proof
    aadharNumber: { type: String, required: true },
    panCard: { type: String, required: true, uppercase: true },
    photoUrl: { type: String, default: null },
    // Status
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voter', voterSchema);

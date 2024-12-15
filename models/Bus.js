const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
});

const BusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  schedules: [ScheduleSchema],
});

module.exports = mongoose.model("Bus", BusSchema);

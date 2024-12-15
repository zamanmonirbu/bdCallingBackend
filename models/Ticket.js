const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seatNumber: { type: Number, required: true, min: 1 },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    total: { type: Number, required: true, min: 0 },
    mobile: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);

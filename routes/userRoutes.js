const express = require("express");
const {
  viewBuses,
  viewAvailableTickets,
  getBuses,
  bookedSeat,
} = require("../controllers/userController");
const { addTicket } = require("../controllers/adminController");

const router = express.Router();

router.get("/buses", viewBuses);
router.get("/tickets", viewAvailableTickets);
router.post("/bus/search", getBuses);
router.get("/booked-seats/:busId", bookedSeat);
router.post("/book-seat", addTicket);

module.exports = router;

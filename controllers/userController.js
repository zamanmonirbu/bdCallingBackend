const Bus = require("../models/Bus");
const Ticket = require("../models/Ticket");

const viewBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json({ message: "Buses retrieved successfully", buses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving buses", error });
  }
};

const viewAvailableTickets = async (req, res) => {
  try {
    const { busId } = req.query;
    const query = busId
      ? { busId, status: "available" }
      : { status: "available" };
    const tickets = await Ticket.find(query);
    res.status(200).json({ message: "Tickets retrieved successfully", tickets });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tickets", error });
  }
};

const getBuses = async (req, res) => {
  try {
    const { from, to, departureTime } = req.body;

    const query = {
      "schedules.from": from,
      "schedules.to": to,
    };
    if (departureTime) {
      query["schedules.departureTime"] = departureTime;
    }

    const buses = await Bus.find(query);

    if (buses.length === 0) {
      res.status(404).json({ message: "No buses found" });
      return;
    }

    res.status(200).json(buses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const bookedSeat = async (req, res) => {
  try {
    const { busId } = req.params;

    // Validate busId
    if (!busId) {
      res.status(400).json({ message: "Bus ID is required" });
      return;
    }

    // Get only the seat numbers to avoid sending unnecessary data
    const bookedSeats = await Ticket.find({ busId }).select('seatNumber -_id');

    res.status(200).json({ 
      message: "Booked seats retrieved successfully", 
      bookedSeats 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve booked seats", error });
  }
};

module.exports = { viewBuses, viewAvailableTickets, getBuses, bookedSeat };

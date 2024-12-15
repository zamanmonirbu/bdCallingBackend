const Bus = require("../models/Bus");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

exports.addBus = async (req, res) => {
  try {
    const { name, totalSeats, schedules } = req.body;
    if (!name || !totalSeats || !schedules || schedules.length === 0) {
      res.status(400).json({ message: "Name, totalSeats, and schedules are required." });
      return;
    }
    const newBus = new Bus({ name, totalSeats, schedules });
    await newBus.save();
    res.status(201).json({ message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding bus", error });
  }
};

exports.getBus = async (req, res) => {
  try {
    const allBuses = await Bus.find({});
    res.status(200).json({ message: "Buses found successfully", buses: allBuses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding buses", error });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBus = await Bus.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBus) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }
    res.status(200).json({ message: "Bus updated successfully", updatedBus });
  } catch (error) {
    res.status(400).json({ message: "Error updating bus", error });
  }
};

exports.getSpecificBus = async (req, res) => {
  try {
    const { id } = req.params;
    const foundBus = await Bus.findById({ _id: id });
    if (!foundBus) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }
    res.status(200).json({ message: "Bus found successfully", foundBus });
  } catch (error) {
    res.status(400).json({ message: "Error updating bus", error });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBus = await Bus.findByIdAndDelete(id);
    if (!deletedBus) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting bus", error });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const allTickets = await Ticket.find({}).sort({ createdAt: -1 });
    res.status(200).json({ message: "Buses found successfully", buses: allTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding buses", error });
  }
};

exports.getTicketsById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundTicket = await Ticket.findOne({ userId: id }).populate("busId"); 
    if (!foundTicket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }
    res.status(200).json({ message: "Ticket found successfully", foundTicket });
  } catch (error) {
    res.status(400).json({ message: "Error fetching ticket", error });
  }
};

exports.addTicket = async (req, res) => {
  try {
    const { userId, userMobile, seats, totalPrice, paymentStatus } = req.body;
    if (!seats || seats.length === 0) {
      res.status(400).json({ message: "No seats selected for booking." });
      return;
    }
    const tickets = await Promise.all(seats.map(async (seat) => {
      const bus = await Bus.findById(seat.busId);
      if (!bus) {
        throw new Error(`Bus with ID ${seat.busId} not found`);
      }
      return Ticket.create({
        userId,
        mobile: userMobile,
        seatNumber: seat.seatNumber,
        busId: seat.busId,
        paymentStatus,
        total: seat.price, 
      });
    }));
    res.status(201).json({ message: "Tickets booked successfully", tickets, totalPrice });
  } catch (error) {
    res.status(400).json({ message: "Error booking tickets", error });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTicket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }
    res.status(200).json({ message: "Ticket updated successfully", updatedTicket });
  } catch (error) {
    res.status(400).json({ message: "Error updating ticket", error });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting ticket", error });
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, address, mobile, role, status } = req.body;
  try {
    const updatedData = { name, email, address, mobile, role, status };
    if (password) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedData }, { new: true, runValidators: true });
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};
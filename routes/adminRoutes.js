const express = require("express");
const {
  addBus,
  getBus,
  updateBus,
  deleteBus,
  addTicket,
  updateTicket,
  deleteTicket,
  getSpecificBus,
  fetchUsers,
  updateUserStatus,
  deleteUser,
  getTickets,
  getTicketsById,
} = require("../controllers/adminController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Bus routes
router.get("/bus", protect, getBus);
router.post("/bus", protect, addBus);
router.get("/bus/:id", protect, getSpecificBus);
router.put("/bus/:id", protect, updateBus);
router.delete("/bus/:id", protect, deleteBus);

// Ticket routes
router.post("/ticket", protect, addTicket);
router.get("/tickets", protect, getTickets);
router.get("/ticket/:id", protect, getTicketsById);
router.put("/ticket/:id", protect, updateTicket);
router.delete("/ticket/:id", protect, deleteTicket);

// Fetch all users
router.get("/users", protect, fetchUsers);

// Update user status (activate or deactivate)
router.put("/users/:userId/status", protect, updateUserStatus);

// Delete a user
router.delete("/users/:userId", protect, deleteUser);

module.exports = router;

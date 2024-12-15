const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshToken);

module.exports = router;

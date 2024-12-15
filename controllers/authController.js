const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, address, mobile, role } = req.body;
    if (!name || !email || !password || !mobile || !address) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      mobile,
      address,
      role,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "An error occurred while registering the user. Please try again later.",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "55m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      role: user.role,
      mobile: user.mobile,
    };
    res.status(200).json({
      message: "Login successful",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error occurred while logging in" });
  }
};

exports.logoutUser = (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Server error occurred while logging out" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(401).json({ message: "Refresh token is required" });
      return;
    }

    jwt.verify(
      token,
      process.env.REFRESH_SECRET,
      (err, decoded) => {
        if (err) {
          res.status(403).json({ message: "Invalid refresh token" });
          return;
        }

        const { id, role } = decoded || {};
        const newAccessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
          expiresIn: "15h",
        });

        res.status(200).json({
          message: "Access token refreshed successfully",
          accessToken: newAccessToken,
        });
      }
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Server error occurred while refreshing token" });
  }
};

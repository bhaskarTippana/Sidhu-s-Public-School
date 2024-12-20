// controllers/authController.js
import bcrypt from "bcryptjs";
import {createUser, findUserByUsername } from "../models/User.js";
import { generateToken } from "../utils/verifyjwt.js"; // Assuming generateToken is already defined

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password, role_id } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await findUserByUsername(name);
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    await createUser(name, email, hashedPassword, role_id);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error registering user" });
  }
};

// Login user (check by username and password)
export const loginUser = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Find user by username (instead of email)
    const user = await findUserByUsername(name);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate the tokens
    const permanentToken = generateToken(user.id, user.role, "permanent");
    const sessionToken = generateToken(user.id, user.role, "session");

    // Set cookies
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("permanentToken", permanentToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error logging in user" });
  }
};


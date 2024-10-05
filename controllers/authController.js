import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import cookie from 'cookie';

import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: "12h" });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000
    });

    console.log('Cookie set:', res.getHeader('Set-Cookie'));

    res.status(200).json({ message: "Logged in successfully", user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("inside try catch");

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id.toString() }, JWT_SECRET, { expiresIn: "48h" });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 12 * 60 * 60 * 1000
      });

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }

};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "logged-out" });
};

export const googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, password: 'default'});
      await user.save();
    }

    res.status(200).json({
      message: "User logged in successfully",
      user: { name: user.name, email: user.email, id: user._id }
    });
  }
   catch (error) {
    console.log("Error during Google login:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      res.json({ isLoggedIn: true });
    } catch (error) {
      res.json({ isLoggedIn: false });
    }
  }
  else {
    res.json({ isLoggedIn: false });
  }
};

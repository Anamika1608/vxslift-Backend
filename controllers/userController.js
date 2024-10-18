import User from "../models/user.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const getUser = async (req, res) => {
  try {
    // console.log('Request headers:', req.headers);
    // console.log('Cookies received:', req.cookies);

    const token = req.cookies.token;

    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Token found:', token);

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({ message: 'Invalid token', error: jwtError.message });
    }

    const userId = decoded.id;
    console.log('User ID from token:', userId);

    const user = await User.findById(userId).select('name email');

    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    res.status(200).json({ name: user.name, email: user.email, id: user._id , status : user.status});
  }
  catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const findByEmail = async (req, res) => {
  console.log(req.query)
  const { mail } = req.query;

  try {
    const user = await User.findOne({ email: mail });

    if (!user) {
      console.log('User not found for email:', mail);
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ userId: user._id  , status : user.status});
  } catch (error) {
    console.error('Error finding user by email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateStatus = async (req, res) => {
  try {
    const { planId, userId, status } = req.body;
    if (!userId) return res.status(401).json({ message: "User ID not provided" });
    if (!status) return res.status(400).json({ message: "Status not provided" });

    const user = await User.findOneAndUpdate(
      { _id: userId, "purchased_plans.plan": planId },
      { $set: { "purchased_plans.$.status": status } }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: "User or Plan not found" });
    }

    return res.status(200).json({ message: "Status updated successfully", user });
  } catch (error) {
    console.log("Error in saving status", error);
    return res.status(500).json({ message: "Error in saving the status" });
  }
};


export const getStatus = async (req, res) => {
  try {
    const { planId, userId } = req.body;
    if (!userId) return res.status(401).json({ message: "User ID not provided" });

    const user = await User.findOne(
      { _id: userId, "purchased_plans.plan": planId },
      { "purchased_plans.$": 1 } 
    );

    if (!user || !user.purchased_plans.length) {
      return res.status(404).json({ message: "User or Plan not found" });
    }

    const status = user.purchased_plans[0].status;

    return res.status(200).json({ message: "Status fetched successfully", status });
  } catch (error) {
    console.log("Error in fetching status", error);
    return res.status(500).json({ message: "Error in fetching the status" });
  }
};

import User from "../models/user";
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
      
      res.status(200).json({ name: user.name, email: user.email,id: user._id});
    }
    catch (error) {
      console.error('Error in getUser:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
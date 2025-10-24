import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function (no change)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: 'Please enter your name' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // --- MODIFIED: Add console.error for debugging ---
    console.error('Error in registerUser:', error); // This will show the real error
    res.status(500).json({ message: 'Server Error' });
    // --- END MODIFICATION ---
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // --- MODIFIED: Add console.error for debugging ---
    console.error('Error in loginUser:', error); // This will show the real error
    res.status(500).json({ message: 'Server Error' });
    // --- END MODIFICATION ---
  }
};

export { registerUser, loginUser };
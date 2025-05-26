const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');
const Budget = require('../models/Budget');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Create default categories for the user
      const defaultCategories = [
        { name: 'Food', type: 'expense', user: user._id },
        { name: 'Transport', type: 'expense', user: user._id },
        { name: 'Entertainment', type: 'expense', user: user._id },
        { name: 'Utilities', type: 'expense', user: user._id },
        { name: 'Others', type: 'expense', user: user._id },
        { name: 'Salary', type: 'income', user: user._id },
        { name: 'Freelance', type: 'income', user: user._id },
        { name: 'Investments', type: 'income', user: user._id }
      ];
      try {
        await Category.insertMany(defaultCategories);
      } catch (err) {
        console.error('Error creating default categories:', err);
      }

      // Create default budgets for the user (empty or zero)
      const defaultBudgets = [
        { category: 'Food', amount: 0, user: user._id },
        { category: 'Transport', amount: 0, user: user._id },
        { category: 'Salary', amount: 0, user: user._id },
        { category: 'Freelance', amount: 0, user: user._id }
      ];
      try {
        await Budget.insertMany(defaultBudgets);
      } catch (err) {
        console.error('Error creating default budgets:', err);
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check password
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };

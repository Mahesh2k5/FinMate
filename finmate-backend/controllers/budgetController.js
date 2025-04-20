const Budget = require('../models/Budget');

// Get all budget goals for a user
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add or update a budget goal
const addOrUpdateBudget = async (req, res) => {
  try {
    const { category, amount } = req.body;

    // Check if budget exists
    let budget = await Budget.findOne({ 
      user: req.user._id,
      category
    });

    if (budget) {
      // Update existing budget
      budget.amount = amount;
      await budget.save();
      res.json(budget);
    } else {
      // Create new budget
      budget = new Budget({
        user: req.user._id,
        category,
        amount
      });

      const savedBudget = await budget.save();
      res.status(201).json(savedBudget);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBudgets, addOrUpdateBudget };

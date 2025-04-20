const express = require('express');
const router = express.Router();
const { getBudgets, addOrUpdateBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getBudgets)
  .post(protect, addOrUpdateBudget);

module.exports = router;

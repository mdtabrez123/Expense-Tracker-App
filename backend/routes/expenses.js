const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   POST /api/expenses
// @desc    Create an expense
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    const newExpense = new Expense({
      user: req.user.id,
      amount,
      category,
      note,
      date
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses for a specific user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/expenses/summary
// @desc    Get total amount spent per category for a specific user
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { 
        $match: { user: new mongoose.Types.ObjectId(req.user.id) } 
      },
      { 
        $group: { 
          _id: '$category', 
          totalAmount: { $sum: '$amount' } 
        } 
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, category, note, date } = req.body;

    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    if (note !== undefined) expense.note = note;
    if (date) expense.date = date;

    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Expense not found' });
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await expense.deleteOne();
    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Expense not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
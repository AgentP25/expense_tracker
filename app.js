// Created By  : Adryan Cheah @
// Created On  :
// Purpose     :
// Description :


const express = require('express');
const mongoose = require('mongoose');
const Expense = require('./models/expense');
const index = require('./views/index');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/expenseTracker');

// 1. Show the main page of the expense tracker app with the list and charts
app.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find();
        
        // 1. Group totals by category
        const totals = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        // 2. Prepare labels and data for the chart
        const chartLabels = Object.keys(totals); // e.g., ["Food", "Transport"]
        const chartData = Object.values(totals);   // e.g., [50, 20]

        // 3. SEND EVERYTHING to the view
        res.render('/index', { 
            expenses: expenses, 
            chartLabels: chartLabels, 
            chartData: chartData 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// 2. Handle for manual form submission 
app.post('/add', async (req, res) => {
    const { title, amount, category } = req.body;
    const expense = new Expense({ title, amount, category });
    res.redirect('/');
})

app.listen(3000, () => 
    console.log("Server is running on port 3000"));

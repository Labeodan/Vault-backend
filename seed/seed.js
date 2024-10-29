const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Category = require("../models/category");
const Transaction = require("../models/transaction");
const Budget = require("../models/budget");
require("dotenv/config")

const mongoURI = process.env.MONGODB_URI


const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Clear existing data
        await User.deleteMany();
        await Category.deleteMany();
        await Transaction.deleteMany();
        await Budget.deleteMany();

        // Load data from JSON files
        const usersData = JSON.parse(fs.readFileSync("./seed/users.json"));
        const categoriesData = JSON.parse(fs.readFileSync("./seed/categories.json"));
        const transactionsData = JSON.parse(fs.readFileSync("./seed/transactions.json"));
        const budgetsData = JSON.parse(fs.readFileSync("./seed/budgets.json"));

        // Create users with hashed passwords
        const users = await Promise.all(usersData.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 12);
            return User.create({ username: user.username, password: hashedPassword });
        }));
        console.log("Users seeded:", users);

        // Create categories
        const categories = await Category.insertMany(categoriesData);
        console.log("Categories seeded:", categories);

        // Create transactions
        for (const user of users) {
            const userTransactions = transactionsData.map(transaction => ({
                ...transaction,
                owner: user._id,
                category: categories[Math.floor(Math.random() * categories.length)]._id // Assign random category
            }));
            await Transaction.insertMany(userTransactions);
        }
        console.log("Transactions seeded");

        // Create budgets
        for (const user of users) {
            const userBudgets = budgetsData.map(budget => ({
                ...budget,
                owner: user._id,
                category: categories[Math.floor(Math.random() * categories.length)]._id // Assign random category
            }));
            await Budget.insertMany(userBudgets);
        }
        console.log("Budgets seeded");

        await mongoose.disconnect();
        console.log("Database seeding completed successfully!");
    } catch (error) {
        console.error("Error seeding the database:", error);
        await mongoose.disconnect();
    }
};

seedDatabase();
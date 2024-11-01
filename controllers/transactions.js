const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const verifyToken = require("../middleware/verifyToken");
const Category = require("../models/category");
const mongoose = require("mongoose");
const User = require("../models/user");

// ! Transaction routes

// Create Transaction
router.post("", verifyToken, async (req, res) => {
    try {
        const { name, amount, category, type } = req.body;

        // Check for duplicate transaction by name and owner
        // const existingTransaction = await Transaction.findOne({ owner: req.user._id, name }).populate("category");
        // if (existingTransaction) {
        //     console.log("Transaction already exists");
        //     return res.status(409).json({ error: "Transaction already exists" });
        // }

        // Validate category existence
        const categoryObj = await Category.findOne({ name: category });
        if (!categoryObj) {
            console.log("Category does not exist");
            return res.status(400).json({ error: "The category does not exist" });
        }

        // Set transaction details and create
        const transactionDetails = {
            name,
            amount,
            category: categoryObj._id,
            owner: req.user._id,
            type,
        };
        const newTransaction = await Transaction.create(transactionDetails);

        return res.status(201).json(newTransaction);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while creating the transaction" });
    }
});

// Get All Transactions for User
router.get("", verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;

        // Validate user existence
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }

        // Retrieve user's transactions
        const transactions = await Transaction.find({ owner: userId }).populate("category");
        console.log(transactions);
        return res.status(200).json({ transactions });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while retrieving transactions" });
    }
});

// Get Single Transaction
router.get("/:transactionId", verifyToken, async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Validate transaction ID
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }

        // Check if transaction exists and ownership
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        if (!req.user._id.equals(transaction.owner)) {
            console.log("Unauthorized access to transaction");
            return res.status(403).json({ error: "Forbidden: Not the owner" });
        }

        return res.status(200).json(transaction);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while retrieving the transaction" });
    }
});

// Update Transaction
router.put("/:transactionId", verifyToken, async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { name, amount, category, type } = req.body;

        // Validate transaction ID
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }

        // Check if transaction exists and ownership
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        if (!req.user._id.equals(transaction.owner)) {
            console.log("Unauthorized access to transaction");
            return res.status(403).json({ error: "Forbidden: Not the owner" });
        }

        // Validate and assign category if provided
        let categoryId = transaction.category;
        if (category) {
            const categoryObj = await Category.findOne({ name: category });
            if (!categoryObj) {
                console.log("Category does not exist");
                return res.status(400).json({ error: "The category does not exist" });
            }
            categoryId = categoryObj._id;
        }

        // Update transaction details
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            transactionId,
            { name, amount, category: categoryId, type },
            { new: true }
        );

        return res.status(202).json(updatedTransaction);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while updating the transaction" });
    }
});

// Delete Transaction
router.delete("/:transactionId", verifyToken, async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Validate transaction ID
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }

        // Check if transaction exists and ownership
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        if (!req.user._id.equals(transaction.owner)) {
            console.log("Unauthorized access to transaction");
            return res.status(403).json({ error: "Forbidden: Not the owner" });
        }

        // Delete transaction
        await Transaction.findByIdAndDelete(transactionId);
        return res.status(200).json({ message: "Transaction deleted successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while deleting the transaction" });
    }
});

module.exports = router;

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    type: {
        type: String,
        enum: {
            values: ['Expense', 'Income'],
            message: 'Only "Expense" and "Income" values are valid.',
        },
        default: "Expense",
        required: true,
    }

}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
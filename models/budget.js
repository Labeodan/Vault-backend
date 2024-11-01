const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    target: {
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
    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
        required: true,
    },

}, { timestamps: true });

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;
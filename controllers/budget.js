const express = require("express");
const router = express.Router();
const Budget = require("../models/budget");
const verifyToken = require("../middleware/verifyToken");
const Category = require("../models/category");
const mongoose = require("mongoose");

// Create a new budget
router.post("/", verifyToken, async (req, res) => {
    try {
        const { name, target, category, startDate, endDate } = req.body;

        // Check for duplicate budget by name and owner
        const existingBudget = await Budget.findOne({ owner: req.user._id, name });
        if (existingBudget) {
            return res.status(409).json({ error: "Budget with this name already exists" });
        }

        // Find category by name and validate existence
        const categoryObj = await Category.findOne({ name: category });
        if (!categoryObj) {
            return res.status(400).json({ error: "The specified category does not exist" });
        }

        // Create new budget with category ObjectId
        const newBudget = new Budget({
            name,
            target,
            category: categoryObj._id,
            owner: req.user._id,
            startDate,
            endDate,
        });
        await newBudget.save();

        return res.status(201).json(newBudget);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while creating the budget" });
    }
});

// Get all budgets for a user
router.get("/", verifyToken, async (req, res) => {
    try {
        const budgets = await Budget.find({ owner: req.user._id }).populate("category");
        return res.status(200).json({ budgets });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while retrieving budgets" });
    }
});

// Get a single budget by ID
router.get("/:budgetId", verifyToken, async (req, res) => {
    try {
        const { budgetId } = req.params;

        // Validate budget ID
        if (!mongoose.Types.ObjectId.isValid(budgetId)) {
            return res.status(400).json({ error: "Invalid budget ID" });
        }

        const budget = await Budget.findById(budgetId).populate("category");
        if (!budget || !budget.owner.equals(req.user._id)) {
            return res.status(404).json({ error: "Budget not found or access forbidden" });
        }

        return res.status(200).json(budget);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while retrieving the budget" });
    }
});

// Update a budget by ID
router.put("/:budgetId", verifyToken, async (req, res) => {
    try {
        const { budgetId } = req.params;
        const { name, target, category, startDate, endDate } = req.body;

        // Validate budget ID
        if (!mongoose.Types.ObjectId.isValid(budgetId)) {
            return res.status(400).json({ error: "Invalid budget ID" });
        }

        // Check ownership and existence of budget
        const budget = await Budget.findById(budgetId);
        if (!budget || !budget.owner.equals(req.user._id)) {
            return res.status(404).json({ error: "Budget not found or access forbidden" });
        }

        // Validate and assign category if provided
        let categoryId = budget.category;
        if (category) {
            const categoryObj = await Category.findOne({ name: category });
            if (!categoryObj) {
                return res.status(400).json({ error: "The specified category does not exist" });
            }
            categoryId = categoryObj._id;
        }

        // Update budget details
        const updatedBudget = await Budget.findByIdAndUpdate(
            budgetId,
            { name, target, category: categoryId, startDate, endDate },
            { new: true, runValidators: true }
        );

        return res.status(200).json(updatedBudget);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while updating the budget" });
    }
});

// Delete a budget by ID
router.delete("/:budgetId", verifyToken, async (req, res) => {
    try {
        const { budgetId } = req.params;

        // Validate budget ID
        if (!mongoose.Types.ObjectId.isValid(budgetId)) {
            return res.status(400).json({ error: "Invalid budget ID" });
        }

        // Check ownership and existence of budget
        const budget = await Budget.findById(budgetId);
        if (!budget || !budget.owner.equals(req.user._id)) {
            return res.status(404).json({ error: "Budget not found or access forbidden" });
        }

        // Delete budget
        await Budget.findByIdAndDelete(budgetId);
        return res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while deleting the budget" });
    }
});

module.exports = router;

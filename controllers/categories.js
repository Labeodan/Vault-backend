const express = require("express")
const Category = require("../models/category")
const router = express.Router()

router.post("", async (req, res) => {
    try {
        const { name } = req.body

        // check if category already exists
        const category = await Category.findOne({ name: name })

        if (!category) {
            const createCategory = await Category.create(defaultCategories)
            return res.status(201).json(createCategory)
        } else {
            return res.status(401).json({ error: "Category already exists" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
})

router.get("", async (req, res) => {

    try {
        const categories = await Category.find();
        return res.status(201).json(categories);
    } catch (error) {
        return res.status(400).json({ error: "Error in the query" })

    }
})

// const User = require("../models/user.js");

// //define the objectId for mongoose 
// const ObjectId = require('mongodb').ObjectId;

// /* Read */
// //Index of budgets
// router.get("/", async (req, res) => {
//     try {
//         //value of id from the user that created the baseline categories 
//         const BASE_CATEGORY_CREATOR = "whatever";
//         //TODO, add filter options 
//         const categories = await Categories.find({ $or: [{ 'owner': ObjectId.createFromHexString(req.session.user._id) }, { 'owner': ObjectId.createFromHexString(adminID) }] }).sort({ createdAt: 'desc' });
//         res.status(200).json(categories);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// })

// //Single budget 
// router.get("/:budgetId'", async (req, res) => {
//     try {
//         //TODO, add filter options 
//         const category = await Budget.findById(req.params.budgetId);
//         res.status(200).json(category);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// })

// /* Create */
// router.post("/", async (req, res) => {
//     try {
//         //req.body.owner = req.user._id;
//         // to be used once login is working
//         const budget = await Budget.create(req.body);
//         console.log(budget);
//         res.status(201).json(budget);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error);
//     }

// });

// /* Edit */
// router.put("/", async (req, res) => {
//     try {
//         let budget = await Budget.findByIdAndUpdate(req.params.taskId, req.body);
//         console.log(budget);
//         res.status(201).json(budget);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error);
//     }
// })


// //Delete task
// router.delete("/:taskId/delete", async (req, res) => {
//     try {
//         let budget = await Budget.findByIdAndDelete(req.params.taskId);
//         res.status(201).json(budget);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error);
//     }
// })

module.exports = router;
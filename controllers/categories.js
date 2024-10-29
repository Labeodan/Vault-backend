const express = require("express")
const Category = require("../models/category")
const router = express.Router()

// const defaultCategories = [
//     { name: "Food", color: "ff0000" },
//     { name: "Transport", color: "00ff00" },
//     { name: "Shopping", color: "0000ff" },
//     { name: "Entertainment", color: "ffa500" },  // Orange
//     { name: "Healthcare", color: "ff69b4" },     // Pink
//     { name: "Utilities", color: "8a2be2" },      // Purple
//     { name: "Education", color: "4682b4" }       // Steel Blue
// ];


router.post("", async (req, res) => {
    try {
        const { name } = req.body

        // check if category already exists
        const category = await Category.findOne({name: name})

        if (!category) {
            const createCategory = await Category.create(defaultCategories)
            return res.status(201).json(createCategory)
        } else {
            return res.status(401).json({error: "Category already exists"})
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error})
    }
})




module.exports = router
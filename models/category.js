const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        require: true,
        default: "ffffff"
    },

});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
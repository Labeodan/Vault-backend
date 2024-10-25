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
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },

});

const Category = mongoose.model("Categories", userSchema);
module.exports = Category;
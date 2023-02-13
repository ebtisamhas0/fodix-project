const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ID: {
        type: String,
        required: true,
        unique: true
    },
    percentage: {
        type: Number
    }
    ,
    isActive: {
        type: Boolean,
        required: true
    }
}, {
    strictQuery: true
  }
)

module.exports = mongoose.model("courses", coursesSchema);
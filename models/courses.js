const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    strictQuery: true
  }
)

module.exports = mongoose.model("courses", coursesSchema);
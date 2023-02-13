const mongoose = require("mongoose");

const pointsSchema = new mongoose.Schema({
    Amount: {
        type: int,
        required: true
    },
    ID: {
        type: String,
        required: true,
        unique: true
    },
    userID: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
    ],

}, {
    strictQuery: true
  }
);


module.exports = mongoose.model("points", pointsSchema);
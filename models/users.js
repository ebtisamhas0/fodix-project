const mongoose = require('mongoose');
Schema = mongoose.Schema;

const profileSchema = Schema({
    birthDate: {
        type: Date,
        required: "birthdate is required"
    },
    profileImage: {
        type: String,
    }
})
const userSchema = Schema({
    name: {
        type: String,
        required: "name is required"
    },
    email: {
        type: String,
        unique: true,
        required: "email is required"
    },
    phone:{
        type:String
    },
    password: {
        type: String,
        required: "password is required"
    },
    roles: {
        type: [
            {
                type: String,
                enum: ["manager", "admin", "customer"],
            },
        ],
        default: ["customer"],
    },
    userProfile: {
        type:profileSchema
    }
},
    {
        timestamps: true
    }
    , {
        strictQuery: true
      }
);

module.exports = mongoose.model("users", userSchema);
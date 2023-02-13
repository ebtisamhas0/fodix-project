const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const router = require("./routes/router");
const path = require('path');

const PORT = 3000;
dotenv.config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))


router.default(app)

app.listen(PORT, () => {
    console.log("express started on port 3000")
})


// For outside url
// mongoose
//     .connect(process.env.MONGODB_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     }).then(() => {
//         console.log("Connected to MongoDB");
//     }).catch((err) => {
//         console.log(err);
//     })

// localhost
mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.MONGO_URL}`, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("mongodb is connected")
});

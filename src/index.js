
const express = require('express');

const app = express();
const userRouter = require('./routes/userRoutes');
const notesRouter = require('./routes/notesRoutes');
const dotenv= require("dotenv");
const cors = require("cors");


dotenv.config();


const mongoose = require('mongoose');

app.use(express.json());

app.use(cors());

app.use("/users", userRouter);
app.use("/notes", notesRouter);

app.get("/", (req, res) => {

    res.send("Note APi in expressJS");

});


const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Sever started on port "+ PORT);
        });

    }).catch((error) => {
        console.log(error);
    })






const express = require('express');

const app = express();
const userRouter = require('./routes/userRoutes');
const notesRouter = require('./routes/notesRoutes');


const mongoose = require('mongoose');

app.use(express.json());


app.use((req, res, next) => {
    console.log("HTTP Method - " + req.method + ",URL - " + req.url);
    next();

});

app.use("/users", userRouter);
app.use("/notes", notesRouter);

app.get("/", (req, res) => {

    res.send("Hello World!");

});

mongoose.connect("mongodb+srv://maurya:maurya@cluster0.wstvoq2.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        app.listen(5000, () => {
            console.log("Sever started on port 5000 ");
        });

    }).catch((error) => {
        console.log(error);
    })





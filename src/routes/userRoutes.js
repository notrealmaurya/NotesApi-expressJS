

const express = require("express");

const userRouter = express.Router();


userRouter.post("/signup", (req, res) => {


    


});

userRouter.post("/signin", (req, res) => {

    res.send("Hello World!");



});


module.exports = userRouter;
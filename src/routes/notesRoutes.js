

const express = require("express");

const notesRouter = express.Router();


notesRouter.get("/", (req, res) => {


    res.send("Notes get");




});

notesRouter.post("/", (req, res) => {

    res.send("Notes post");


});


module.exports = notesRouter;


const express = require("express");
const { signUp, signIn } = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/signup", signUp)

userRouter.post("/signin", signIn)


module.exports = userRouter;
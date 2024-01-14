const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "NOTESAPI";

const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await userModel.create({
            email: email,
            password: hashPassword,
            username: username
        });

        // Generate a JWT token
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, SECRET_KEY);

        // Return user data and token
        res.status(201).json({ user: newUser, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};




const signIn = async (req, res) => {




};


module.exports = { signUp, signIn };


const jwt = require('jsonwebtoken');
const { use } = require('../routes/userRoutes');

const SECRET_KEY = process.env.SECRET_KEY;

const auth = (req, res, next) => {


    try {
        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];

            let user = jwt.verify(token, SECRET_KEY);

            req.userId = user.id;

        }
        else {
            return res.status(401).json({ message: "You are not logged in" })
        }

        next();


    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "You are not logged in" })

    }



}

module.exports = auth;
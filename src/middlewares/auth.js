
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    console.error('SECRET_KEY is not set in environment variables');
    process.exit(1);
}

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is required" });
        }

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Invalid authorization format. Use 'Bearer <token>'" });
        }

        const token = authHeader.split(" ")[1];
        const user = jwt.verify(token, SECRET_KEY);

        if (!user.id) {
            return res.status(401).json({ message: "Invalid token: missing user ID" });
        }

        req.userId = user.id;
        next();

    } catch (error) {
        console.log(error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }

        res.status(401).json({ message: "You are not logged in" });
    }
}

module.exports = auth;
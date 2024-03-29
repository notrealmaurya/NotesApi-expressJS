# Notes API with User Authentication
>This repository contains an Express.js API for managing notes with user authentication. It provides endpoints for user sign-up, sign-in, and CRUD operations on notes.
 <div>
    <img src="https://ajeetchaulagain.com/static/7cb4af597964b0911fe71cb2f8148d64/8d565/express-js.webp" width="40" height="40">
    <img src="https://www.desuvit.com/wp-content/uploads/2021/03/mongodb-icon.png" width="40" height="40">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOW34PFNB2wJ1Hf5AP88UYB4d-LDcOsC7i4g&usqp=CAU" width="40" height="40">
</div>


## Features

- User authentication: Sign-up and sign-in functionality.
- Secure storage: User passwords are hashed before storage.
- CRUD operations: Create, read, update, and delete notes.
- Authorization: Ensure users can only access their own notes.

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/notrealmaurya/NotesApi-expressJS.git
   ```

2. Navigate to the project directory:
   ```bash
   cd NotesApi-expressJS
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Define the following variables:
     - `PORT`: Port for the Express server.
     - `MONGO_URL`: MongoDB connection URL.
     - Optionally, any other configuration variables.

5. Start the server:
   ```bash
   npm start
   ```

## Usage

### User Authentication

1. **Sign-up**: Register a new user by sending a POST request to `/users/signup` with the user's username, email, and password.
2. **Sign-in**: Log in as an existing user by sending a POST request to `/users/signin` with the user's email and password. This will return an authentication token.

### Notes Management

1. **Create a Note**: Send a POST request to `/notes` with the note content in the request body. Include the user's authentication token in the request headers for authorization.
2. **Read Notes**: Retrieve all notes by sending a GET request to `/notes`. Include the user's authentication token in the request headers.
3. **Update a Note**: Send a PUT request to `/notes/:id` with the note ID in the URL and the updated content in the request body. Include the user's authentication token in the request headers for authorization.
4. **Delete a Note**: Send a DELETE request to `/notes/:id` with the note ID in the URL. Include the user's authentication token in the request headers for authorization.

## Technologies Used

- Express.js: Web application framework for Node.js.
- MongoDB: NoSQL database for storing notes and user data.
- Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.
- JWT (JSON Web Tokens): Token-based authentication mechanism.

## User Schema

```javascript
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
```

## Notes Schema

```javascript
const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
```

## Contributing
>Contributions to this project are welcome! If you encounter any bugs, have suggestions for improvements, or want to contribute new features, please open an issue or submit a pull request.


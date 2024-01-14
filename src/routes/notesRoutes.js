

const express = require("express");
const { getNotes, createNote, deleteNote, updateNote } = require("../controllers/noteController");

const auth = require("../middlewares/auth")
const notesRouter = express.Router();


notesRouter.get("/", auth, getNotes);

notesRouter.post("/", auth, createNote);

notesRouter.delete("/:noteId", auth, deleteNote);

notesRouter.put("/:noteId", auth, updateNote);

module.exports = notesRouter;
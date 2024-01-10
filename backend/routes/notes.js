const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");

// Route 1 : Get all the notes using: GET"/api/auth/getUser", Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

// Route 2 : Add a new note using: POST"/api/auth/addnote", Login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Title must have atleast 3 characters").isLength({ min: 3 }),
    body("description", "Description must have atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // Destructuring
      const { title, description, tag } = req.body;

      // If there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = await new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3 : Update an existing note using: PUT "/api/notes/updatenote". Login required.
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Create a new note object
    const newNote = {};

    // Check which fields to update
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: "Not found" });
    }

    // Allow updation only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not allowed" });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4 : Delete an existing note using: DELETE "/api/notes/deletenote". Login required.
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: "Not found" });
    }

    // Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not allowed" });
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

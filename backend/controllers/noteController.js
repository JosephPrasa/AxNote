const Note = require('../models/Note');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Public
const createNote = async (req, res) => {
    const { title, content, category } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const note = await Note.create({
            title,
            content,
            category,
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Public
const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (note) {
            note.title = req.body.title || note.title;
            note.content = req.body.content || note.content;
            note.category = req.body.category || note.category;

            const updatedNote = await note.save();
            res.json(updatedNote);
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Note not found' });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Public
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (note) {
            await note.deleteOne();
            res.json({ message: 'Note removed' });
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Note not found' });
    }
};

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
};

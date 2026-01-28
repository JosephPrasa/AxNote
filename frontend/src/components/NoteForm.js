import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { createNote, updateNote } from '../api/api';

const NoteForm = ({ show, handleClose, currentNote }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.title);
            setContent(currentNote.content);
            setCategory(currentNote.category);
        } else {
            setTitle('');
            setContent('');
            setCategory('');
        }
    }, [currentNote]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (currentNote) {
                await updateNote(currentNote._id, { title, content, category });
            } else {
                await createNote({ title, content, category });
            }
            setLoading(false);
            handleClose();
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{currentNote ? 'Edit Note' : 'Create Note'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="content">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Enter Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Note'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default NoteForm;

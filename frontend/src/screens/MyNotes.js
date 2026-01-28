import React, { useEffect, useState } from "react";
import { Button, Badge, Card } from "react-bootstrap";
import MainScreen from "../components/MainScreen";
import { Link, useNavigate } from "react-router-dom";
import { fetchNotes, deleteNote } from "../api/api";
import NoteForm from "../components/NoteForm";

const MyNotes = () => {
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [refresh, setRefresh] = useState(false); // To trigger re-fetch

    const navigate = useNavigate();

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure?")) {
            await deleteNote(id);
            setRefresh(!refresh);
        }
    };

    const fetchNotesHandler = async () => {
        try {
            const { data } = await fetchNotes();
            setNotes(data);
        } catch (error) {
            console.error(error);
            // handle auth error?
        }
    };

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (!userInfo) {
            navigate("/");
        } else {
            fetchNotesHandler();
        }
    }, [navigate, refresh]);

    const handleEdit = (note) => {
        setCurrentNote(note);
        setShowModal(true);
    };

    const handleCreate = () => {
        setCurrentNote(null);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentNote(null);
        setRefresh(!refresh);
    };

    return (
        <MainScreen title={`Welcome Back ${JSON.parse(localStorage.getItem('userInfo'))?.name}..`}>
            <Link to="#">
                <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg" onClick={handleCreate}>
                    Create New Note
                </Button>
            </Link>
            {notes.map((note) => (
                <Card style={{ margin: 10 }} key={note._id}>
                    <Card.Header style={{ display: "flex", justifyContent: "space-between" }}>
                        <span
                            style={{
                                textDecoration: "none",
                                flex: 1,
                                cursor: "pointer",
                                alignSelf: "center",
                                fontSize: 18,
                            }}
                        >
                            {note.title}
                        </span>
                        <div>
                            <Button href="#" variant="info" className="mx-2" onClick={() => handleEdit(note)}>Edit</Button>
                            <Button href="#" variant="danger" className="mx-2" onClick={() => deleteHandler(note._id)}>Delete</Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <h4>
                            <Badge bg="success" text="light"> {/* Updated for correct bootstrap 5 badge syntax might be needed */}
                                Category - {note.category}
                            </Badge>
                        </h4>
                        <blockquote className="blockquote mb-0">
                            <p>{note.content}</p>
                            <footer className="blockquote-footer">
                                Created on{" "}
                                <cite title="Source Title">
                                    {note.createdAt.substring(0, 10)}
                                </cite>
                            </footer>
                        </blockquote>
                    </Card.Body>
                </Card>
            ))}

            <NoteForm show={showModal} handleClose={handleClose} currentNote={currentNote} />
        </MainScreen>
    );
};

export default MyNotes;

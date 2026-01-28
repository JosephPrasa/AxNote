import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import MainScreen from "../components/MainScreen";
import { updateProfile } from "../api/api";
import { useNavigate } from "react-router-dom";
import './Screen.css';

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pic, setPic] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo) {
            navigate("/");
        } else {
            setName(userInfo.name);
            setEmail(userInfo.email);
            setPic(userInfo.pic);
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            setLoading(true);
            try {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                const user = { name, email, password, pic };
                const { data } = await updateProfile(user);

                localStorage.setItem("userInfo", JSON.stringify(data));
                setLoading(false);
                setMessage("Profile Updated Successfully");
            } catch (error) {
                setMessage(error.message);
                setLoading(false);
            }
        }
    };

    return (
        <MainScreen>
            <div className="loginContainer">
                <h1 className="heading">EDIT PROFILE</h1>
                <Row className="profileContainer">
                    <Col md={6}>
                        {loading && <div>Loading...</div>}
                        {message && <div className="alert alert-info">{message}</div>}
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId="name" className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="email" className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="password" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="confirmPassword" className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                ></Form.Control>
                            </Form.Group>
                            <Button type="submit" variant="primary" style={{ width: '100%' }}>
                                Update Profile
                            </Button>
                        </Form>
                    </Col>
                    <Col
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img src={pic} alt={name} className="img-fluid profilePic" style={{ width: '200px', borderRadius: '50%', border: '4px solid #ec4899', margin: 'auto' }} />
                    </Col>
                </Row>
            </div>
        </MainScreen>
    );
};

export default ProfileScreen;

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import MainScreen from '../components/MainScreen';
import { register } from '../api/api';

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pic] = useState(
        "https://ui-avatars.com/api/?name=User&background=ec4899&color=fff"
    );
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            navigate("/mynotes");
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmpassword) {
            setMessage("Passwords do not match");
        } else {
            setMessage(null);
            try {
                setLoading(true);
                const { data } = await register(name, email, password, pic);
                localStorage.setItem("userInfo", JSON.stringify(data));
                setLoading(false);
                navigate("/mynotes");
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        }
    };

    return (
        <MainScreen>
            <div className="loginContainer">
                <h1 className="heading">REGISTER</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-danger">{message}</div>}
                {loading && <div className="text-center mb-2">Loading...</div>}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmpassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" style={{ width: '100%' }}>
                        Register
                    </Button>
                </Form>
                <Row className="py-3">
                    <Col style={{ textAlign: 'center' }}>
                        Have an Account ? <Link to="/login" style={{ fontWeight: 'bold' }}>Login</Link>
                    </Col>
                </Row>
            </div>
        </MainScreen>
    );
};

export default RegisterScreen;

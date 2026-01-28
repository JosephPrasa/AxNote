import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import MainScreen from '../components/MainScreen';
import { login, googleLogin } from '../api/api';
import './Screen.css';

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        try {
            setLoading(true);
            const { data } = await login(email, password);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/mynotes');
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setLoading(false);
        }
    };

    const googleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const { data } = await googleLogin(credentialResponse.credential);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/mynotes');
        } catch (error) {
            setError(error.response?.data?.message || 'Google Sign In Failed');
            setLoading(false);
        }
    };

    return (
        <MainScreen>
            <div className="loginContainer">
                <h1 className="heading">LOGIN</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading && <div className="loader">Loading...</div>}
                <Form onSubmit={submitHandler}>
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

                    <Button variant="primary" type="submit" style={{ width: '100%' }}>
                        Sign In
                    </Button>
                </Form>
                <div className="py-3" style={{ textAlign: 'center' }}>
                    <GoogleLogin
                        onSuccess={googleSuccess}
                        onError={() => {
                            setError('Google Login Failed');
                        }}
                        theme="filled_black"
                        shape="pill"
                        width="100%"
                    />
                </div>
                <Row className="py-3">
                    <Col style={{ textAlign: 'center' }}>
                        New Here? <Link to="/register" style={{ fontWeight: 'bold' }}>Register Now</Link>
                    </Col>
                </Row>
            </div>
        </MainScreen>
    );
};

export default LoginScreen;

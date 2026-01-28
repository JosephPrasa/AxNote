import React, { useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            navigate("/mynotes");
        }
    }, [navigate]);

    return (
        <div className="main">
            <Container>
                <Row>
                    <div className='intro-text'>
                        <div className="glass-card-landing">
                            <h1 className='title'>Welcome to Notes App</h1>
                            <p className='subtitle'>One Safe place for all your notes.</p>
                            <div className='buttonContainer'>
                                <Link to="/login">
                                    <Button size="lg" className="landingbutton" variant="primary">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="lg" className="landingbutton" variant="outline-primary" style={{ marginLeft: 20 }}>Register</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        </div>
    );
};

export default LandingPage;

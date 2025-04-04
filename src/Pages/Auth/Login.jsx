import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row, Spinner, Alert } from 'react-bootstrap';
import { useLoginMutation } from '../../redux/feature/api/authApi';
import Cookies from 'universal-cookie';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
    const [login, { isLoading }] = useLoginMutation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const cookies = new Cookies();
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await login({ email, password }).unwrap();

            if (response?.token && response?.user) {
                cookies.set('token', response.token, { path: '/' });
                cookies.set('type', response.user.type, { path: '/' });
                setIsLoggedIn(true);

                navigate("/");
            }
        } catch (error) {
            if (error.status === 400) {
                setErrorMessage("Invalid login credentials.");
            } else if (error.status === 404) {
                setErrorMessage("User not found.");
            } else if (error.status === 500) {
                setErrorMessage("Server error, please try again later.");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }
    };

    return (
        <Container>
            <Row className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <Col sm="6" lg="6" className="logn my-4 d-flex flex-column align-items-center">
                    <label className="mx-auto title-login">Login</label>
                    <form onSubmit={handleLogin} className="w-100">
                        <input
                            value={email}
                            placeholder="Email..."
                            type="email"
                            className="user-input my-3 pe-2 w-100"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            value={password}
                            placeholder="Password..."
                            type="password"
                            className="user-input my-3 pe-2 w-100"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type='submit' className="btn-login mx-auto mt-4 w-100" disabled={isLoading}>
                            {isLoading ? <Spinner animation="border" size="sm" /> : 'Login'}
                        </button>
                    </form>
                    {errorMessage && <Alert variant='danger' className="mt-3">{errorMessage}</Alert>}
                </Col>
            </Row>
        </Container>
    );
}

export default Login;

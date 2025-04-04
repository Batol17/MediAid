

 
  import React, { useState } from 'react';
  import { Button, Col, Container, Row, Spinner, Alert } from 'react-bootstrap';
  import PhoneInput from 'react-phone-number-input/input';
  import { Link, useNavigate } from 'react-router-dom';
  import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
  import 'leaflet/dist/leaflet.css';
  import { useSignupMutation } from '../../redux/feature/api/authApi';
  // import { setUser } from '../../redux/feature/slice/AuthSlice';
  import { useDispatch } from 'react-redux';
  import Cookies from 'universal-cookie'; 
import axios from 'axios';
  
  const RegisterPha = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cookies= new Cookies()
    const [signup, { isLoading }] = useSignupMutation();
    const [imge,setImage]=useState('');
    const [url,setImageUrl]=useState('');
    const [coordinates,setCoordinates]=useState([]);
    const [userData, setUserData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      
    });
  
    const [position, setPosition] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
  
    const handleChange = (e) => {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    };
  
    const handlePhoneChange = (value) => {
      setUserData({ ...userData, phone: value });
    };
  
    const handleLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const newCoordinates = [coords.latitude, coords.longitude];
            setPosition(newCoordinates);
            setCoordinates(newCoordinates);
            setUserData((prevData) => ({ ...prevData }));
            setShowMap(true);
          },
          () => alert('Failed to get location.')
        );
      } else {
        alert('Geolocation is not supported by this device.');
      }
    };
    
   
    const handleRegister = async (e) => {
      
      e.preventDefault();
      console.log(userData)
      setErrorMessage('');
      setSuccessMessage('');
  
      const { firstName, lastName, email, password, phone, address } = userData;
  
      if (!firstName || !lastName || !email || !password || !phone || !address || coordinates.length !== 2) {
        setErrorMessage('Please fill in all fields correctly.');
        return;
      }
  
      const form = {
        ...userData,
        location: { type: 'Point', coordinates },
        type: 'user',
        username: firstName + lastName,
        license: ''
      };
  
      try {
        const response = await signup(form).unwrap();
        
        if (response?.data) {
          const { token, user } = response.data;
          cookies.set('token', token);
          // cookies.set('type', token);
        //   dispatch(setUser(user));
  
          setSuccessMessage('Registration successful! Redirecting...');
          setTimeout(() => navigate('/verify'), 2000);
          return;
        }
  
        if (response?.error) {
          console.log("Status Code:", response.error.status);
          if (response.error.status === 400) {
            setErrorMessage("Invalid registration details.");
          } else if (response.error.status === 409) {
            setErrorMessage("Email or phone already registered.");
          } else if (response.error.status === 500) {
            setErrorMessage("Server error, please try again later.");
          } else {
            setErrorMessage("Registration failed. Please check your details.");
          }
        }
      } catch (err) {
        console.error("Registration Error:", err);
        setErrorMessage("An error occurred during registration. Please try again.");
      }
    };
  
    return (
      <Container style={{ minHeight: '670px' }}>
        <Row className="py-5 d-flex justify-content-center align-items-center">
          <Col sm={6} lg={6} className="logn d-flex flex-column align-items-center">
            <label className="mx-auto title-login">Sign Up</label>
  
            <form onSubmit={handleRegister} className="w-100">
              <div className="d-flex gap-1 w-100">
                <input
                  name="firstName"
                  value={userData.firstName}
                  placeholder="First Name"
                  type="text"
                  className="user-input my-3 col-6"
                  onChange={handleChange}
                  required
                />
                <input
                  name="lastName"
                  value={userData.lastName}
                  placeholder="Last Name"
                  type="text"
                  className="user-input my-3 col-6"
                  onChange={handleChange}
                  required
                />
              </div>
  
              <input
                name="email"
                value={userData.email}
                placeholder="Email"
                type="email"
                className="user-input my-3 pe-2 w-100"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                value={userData.password}
                placeholder="Password"
                type="password"
                className="user-input my-3 pe-2 w-100"
                onChange={handleChange}
                required
              />
              <PhoneInput
                placeholder="Enter phone number"
                value={userData.phone}
                onChange={handlePhoneChange}
                className="user-input my-3 pe-2 w-100"
                required
              />
              <input
                name="address"
                value={userData.address}
                placeholder="Your Address"
                type="text"
                className="user-input w-100"
                onChange={handleChange}
                required
              />
              <div className="mt-2 w-100">
                <input
                  type="text"
                  value={coordinates.join(', ')}
                  readOnly
                  placeholder="Select your location from the map"
                  className="user-input w-100"
                />
                <Button onClick={handleLocation} variant="secondary" className="btn my-1">
                  Select your location
                </Button>
  
                {showMap && (
                  <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {position && (
                      <Marker position={position}>
                        <Popup>Your selected location</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                )}
              </div>
  
              <button type="submit" className="btn-login mx-auto mt-4 w-100" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
              </button>
            </form>
  
            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
  
            <label className="mx-auto my-4">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <span style={{ cursor: 'pointer' }} className="text-danger">Login</span>
              </Link>
            </label>
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default RegisterPha;
  
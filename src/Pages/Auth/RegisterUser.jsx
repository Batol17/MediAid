import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner, Alert } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input/input';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../redux/feature/api/authApi';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Fade } from 'react-awesome-reveal';
import Map from '../../Component/Map/Map';

const RegisterUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [signup, { isLoading }] = useSignupMutation();

  const [position, setPosition] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [city, setCity] = useState('');

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

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
          const newPos = { lat: coords.latitude, lng: coords.longitude };
          setPosition(newPos);
          setShowMap(true);
        },
        () => alert('Failed to get location.')
      );
    } else {
      alert('Geolocation is not supported by this device.');
    }
  };


  useEffect(() => {
    if (position) {
      setCoordinates([position.lat, position.lng]);
    }
  }, [position]);
// هاد بجيب اسم المدينة لما بحدد الموقع 
  useEffect(() => {
    const getCityName = async () => {
      if (position) {
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.lat}&lon=${position.lng}`
          );
          const cityName =
            res.data.address.city ||
            res.data.address.town ||
            res.data.address.village ||
            res.data.address.state;
          setCity(cityName || 'غير معروف');
        } catch (error) {
          console.error('Failed to fetch city name:', error);
          setCity('غير معروف');
        }
      }
    };

    getCityName();
  }, [position]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { firstName, lastName, email, password, phone, address } = userData;

    if (!firstName || !lastName || !email || !password || !phone || !address || !position) {
      toast.error('Please fill in all fields correctly.');
      return;
    }

    const form = {
      ...userData,
      location: { type: 'Point', coordinates: [position.lat, position.lng] },
      type: 'user',
      username: firstName + lastName,
    };

    try {
      const response = await signup(form).unwrap();
      response &&  console.log(response);

      if (response?.user) {
console.log(response);

        // const { token, user } = response.data;
        // cookies.set('token', token);
        toast.success('Registration successful! Redirecting...');
        setTimeout(() => navigate('/verify'), 2000);
        return;
      }

      if (response?.error) {
        if (response.error.status === 400) {
          toast.error('Invalid registration details.');
        } else if (response.error.status === 409) {
          toast.error('Email or phone already registered.');
        } else if (response.error.status === 500) {
          toast.error('Server error, please try again later.');
        } else {
          toast.error('Registration failed. Please check your details.');
        }
      }
    } catch (err) {
      console.error('Registration Error:', err);
      toast.error('An error occurred during registration. Please try again.');
    }
  };

  return (
    <Container style={{ minHeight: '670px' }}>
      <Fade delay={300} direction="up" triggerOnce cascade>
        <Row className="py-5 d-flex justify-content-center align-items-center">
          <Col sm={6} lg={6} className="logn d-flex flex-column align-items-center">
            <label className="mx-auto title-login">Sign Up</label>

            <form onSubmit={handleRegister} className="w-100">
              <div className="d-flex justify-content-between">
                <input name="firstName" value={userData.firstName} placeholder="First Name" type="text" className="user-input col-6" onChange={handleChange} required />
                <input name="lastName" value={userData.lastName} placeholder="Last Name" type="text" className="user-input  col-6" onChange={handleChange} required />
              </div>

              <input name="email" value={userData.email} placeholder="Email" type="email" className="user-input my-1  w-100" onChange={handleChange} required />
              <input name="password" value={userData.password} placeholder="Password" type="password" className="user-input my-1 w-100" onChange={handleChange} required />

              <PhoneInput placeholder="Enter phone number" value={userData.phone} onChange={handlePhoneChange} className="user-input my-1  w-100" required />

              <input name="address" value={userData.address} placeholder="Your Address" type="text" className="user-input w-100" onChange={handleChange} required />

              <div className="mt-3 w-100">
                <input type="text" value={coordinates.join(', ')} readOnly placeholder="Select your location from the map" className="user-input w-100" />

                <Button onClick={handleLocation} variant="secondary" className="btn my-2">📍 تحديد موقعي</Button>

                <div>
                  <label>اسم المدينة (يتم تعبئته تلقائيًا):</label>
                  <input type="text" value={city} readOnly className="user-input w-100" />
                </div>

                {showMap && <Map position={position} setPosition={setPosition} />}
              </div>

              <button type="submit" className="btn-submit mx-auto mt-4 w-100" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
              </button>
            </form>

            {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}

            <label className="mx-auto my-4">
              Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}><span className="text-danger">Login</span></Link>
            </label>
            
          </Col>
        </Row>
      </Fade>
    </Container>
  );
};

export default RegisterUser;

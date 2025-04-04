import React, { useEffect } from 'react';
import img from '../../../assets/login.jpg';
import Cookies from 'universal-cookie';
import {  Link, useNavigate } from 'react-router-dom';
import { CiLogin } from 'react-icons/ci';
import { useGetDetailMeQuery, useLogoutMutation } from '../../../redux/feature/api/authApi';
import { Nav,Form } from 'react-bootstrap';
import './SideBar.css';

const SideBar = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const token = cookies.get('token');
    const userType = cookies.get('type');
    const userName = cookies.get('name');

    const { data, error } = useGetDetailMeQuery( { skip: !token });
    const [logout, { isLoading }] = useLogoutMutation();

    const clearAuthCookies = () => {
        cookies.remove('token', { path: '/' });
        cookies.remove('name', { path: '/' });
        cookies.remove('type', { path: '/' });
    };

    useEffect(() => {
        if (data?.firstName && !userName) {
            cookies.set('name', data.firstName, { path: '/', secure: true, sameSite: 'Strict' });
        }
    }, [data, userName]);

    useEffect(() => {
        data && console.log(data);
        
        if (error?.status === 401) {
            clearAuthCookies();
            navigate('/');
        }
    }, [error, navigate]);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            clearAuthCookies();
            window.location.reload();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className='sid ' style={{ minHeight: '85vh' }}>
            <div className='text-center'>
                <img src={img} alt="Profile" className='side-img' />
                <h5 className='mt-2'>
                    Welcome, {userName || data?.firstName || 'User'} 👋
                </h5>
            </div>

            <Nav className='flex-column mt-3'>
            <Nav.Item className='side-item'>
                    <Nav.Link as={Link} to='/my-pharmacy' className='nav-item'>
                        My Pharmacy
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className='side-item fs-5'>
                     <Form>
                     <Form.Check // prettier-ignore
                        type="switch"
                        id="custom-switch"
                        label="State Active"
                        className='mx-2'
                      />
                     </Form>
                </Nav.Item>

                <Nav.Item className='side-item'>
                    <Nav.Link as={Link} to='/orders' className='nav-item'>
                        Orders
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item className='side-item'>
                    <Nav.Link as={Link} to='/store' className='nav-item'>
                        Store
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item className='side-item'>
                    <Nav.Link as={Link} to='/map' className='nav-item'>
                        Map
                    </Nav.Link>
                </Nav.Item>

                {userType === 'pharmacist' && (
                    <Nav.Item className='side-item'>
                        <Nav.Link as={Link} to='/add-medicine' className='nav-item'>
                            Add Medicine
                        </Nav.Link>
                    </Nav.Item>
                )}

                <Nav.Item className='side-item'>
                    <button 
                        className='btn  w-100 ' 
                        onClick={handleLogout} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing Out...' : 'Sign Out'} <CiLogin className='fs-5' />
                    </button>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default SideBar;

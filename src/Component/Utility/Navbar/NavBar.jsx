import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { CiLogin, CiShoppingCart, CiHeart } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import logo from '../../../assets/logo1.png';
import SideBar from '../SideBar/SideBar';
import { IoIosList } from 'react-icons/io';
import { useGetSearchQuery } from '../../../redux/feature/api/categories/categoriesApi';
import { useDispatch, useSelector } from 'react-redux';
import './NavBar.css';
import { setSearchTerm } from '../../../redux/feature/slice/SearchSlice';

function NavBar({ isLoggedIn }) {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const type = cookies.get('type');
  const name = cookies.get('name') || 'User'; 
  const [show, setShow] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isLoggedIn);

  // ✅ تحديث الحالة عند تغيير `isLoggedIn`
  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  // ✅ جلب `searchTerm` من Redux
  const searchTerm = useSelector((state) => state.search.searchTerm);

  // ✅ جلب البيانات باستخدام RTK Query
  const { data } = useGetSearchQuery(
    searchTerm ? `products/search/${searchTerm}` : '',
    { skip: !searchTerm }
  );

  // ✅ تحديث قيمة البحث
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // ✅ منع إعادة تحميل الصفحة عند البحث
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };


  return (
    <div className="nav-bar" style={{ backgroundColor: 'rgb(248, 245, 245)' }}>
      
     
      <Navbar expand="lg">
        <Container className="d-flex justify-content-between align-items-center">
          
          {/* 🔹 اللوجو */}
          <Nav.Link as={Link} to="/">
            <img src={logo} alt="MediAid" className="logo" />
          </Nav.Link>

          <div className="d-flex align-items-center">
            
            {isUserLoggedIn ? (
                 <>
                 <i className="fs-3" onClick={() => setShow(true)} style={{ cursor: "pointer" }}>
                   <IoIosList />
                 </i>
                 <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
                   <Offcanvas.Header closeButton>
                     <Offcanvas.Title>Menu</Offcanvas.Title>
                   </Offcanvas.Header>
                   <Offcanvas.Body>
                     <SideBar />
                   </Offcanvas.Body>
                 </Offcanvas>
               </>
            ) : (
              <>
               
                <Nav.Link as={Link} to="/login" className="me-3 text-dark">
                  Login <CiLogin className="fs-5" />
                </Nav.Link>

               
                <NavDropdown title="SignUp" align="end" menuVariant="light" className="drop-border text-dark">
                  <NavDropdown.Item as={Link} to="/registerPha">Sign Up as a Pharmacist</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/registerUser">Sign Up as a User</NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            
          </div>
        </Container>
      </Navbar>

      
      <Navbar className="search-bg">
        <Container>
          <div className="d-flex justify-content-between align-items-center w-100">
          
            <p className="welcome">Welcome {name} 👋🏻</p>

            
            <Form className="col-7 d-flex mx-auto" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 w-50 mx-auto"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button type="submit" variant="search" className="search">Search</Button>
            </Form>

            
            <div className="col-3 my-auto icons text-light d-flex justify-content-center align-items-center">
              <Nav.Link as={Link} to="/cart" className="me-1">
                <CiShoppingCart /> 
              </Nav.Link>
              |  
              <Nav.Link as={Link} to="/favourite" className="ms-1">
                <CiHeart />
              </Nav.Link>
            </div>

          </div>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;

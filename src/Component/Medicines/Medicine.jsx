import React, { useCallback, useState } from 'react';
import { Button, Card, Col, Form, Modal } from 'react-bootstrap';
import { FaHeart, FaCartPlus } from "react-icons/fa";
import image from '../../assets/7.jpg';
import './Medicines.css';
import { useAddToCartMutation, useAddToFavMutation, useRemoveFromCartMutation } from '../../redux/feature/api/categories/categoriesApi'; // تأكد من إضافة دالة removeFromCart
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addMedicine, setMedicineToPh } from '../../redux/feature/slice/MedicinetoPhaSlice';
const Medicine = ({ medicine }) => {
  const cookies = new Cookies();
  const userType = cookies.get('type');
  const dispatch=useDispatch()
  
  const [addToFav] = useAddToFavMutation(); 
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation(); 
  const [isFavorited, setIsFavorited] = useState(false); 
  const [isInCart, setIsInCart] = useState(false);

  const addToFavourite = () => {
    if (!isFavorited) {
      addToFav(medicine?._id)
        .unwrap() // استخدام unwrap للتعامل مع النتائج بشكل أفضل
        .then(() => {
          setIsFavorited(true);
          console.log('Added to favorites');
        })
        .catch((error) => console.error('Failed to add to favorites: ', error));
    }
  };
  const [form,setForm]=useState({
    id:medicine._id,
    quantity:Number,
    price:Number
  })
   const handleInputChange = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    }, []);

  const addToCartHandler = () => {
    if (!isInCart) {
      addToCart(medicine?._id) 
        .unwrap()
        .then(() => {
          setIsInCart(true);
          console.log('Added to cart');
        })
        .catch((error) => console.error('Failed to add to cart: ', error));
    } else {
      removeFromCart(medicine?._id) 
        .unwrap()
        .then(() => {
          setIsInCart(false);
          console.log('Removed from cart');
        })
        .catch((error) => console.error('Failed to remove from cart: ', error));
    }
  };
  const addTopharmacy=()=>{

    dispatch(addMedicine(form))
    console.log(form);
    
    

  }
  // Modall 
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Col xs={12} sm={6} md={4} lg={3} className='col-card my-1 d-flex justify-content-center align-items-center' style={{ height: '450px !important' }}>
      <Card className='card-pro me-1'>
        <Link to={`/products/products/${medicine?._id}`}>
          <Card.Img variant='top' src={image} className='img-pro' />
        </Link>
        <div className='px-2'>
          <div className='icon-container'>
            <i className='icon-card-heart' onClick={addToFavourite}>
              <FaHeart color={isFavorited ? 'red' : 'gray'} />
            </i>
            <i className='icon-card-cart' onClick={addToCartHandler}>
              <FaCartPlus color={isInCart ? 'green' : 'black'} /> {/* تغيير اللون بناءً على الحالة */}
            </i>
          </div>
          <h5 className='text-danger fs-5'>{medicine?.name}</h5>
          <Card.Text>
            {medicine?.description.length <= 44 ? medicine?.description :` ${medicine?.description.slice(0, 45)}...`}
          </Card.Text>
        </div>
        <div className="d-flex justify-content-between align-items-center px-2 mb-2 mt-auto">
          {/* <img src={rate} alt="Rating" height="16px" width="16px" /> */}
          <p className='price'>{medicine?.price}</p>
        </div>
       {
        userType === 'pharmacist'?
        <button onClick={handleShow} className='btn btn-dark mx-2 mb-1'>Add to my Pharmacy</button> 
        :''
     
       }  </Card>
       {/* modal */}
       <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Control type="number" placeholder="quantity..." value={form.quantity} className="my-2" onChange={e => handleInputChange('quantity', e.target.value)} required />
          <Form.Control type="number" placeholder="price..." value={form.price} className="my-2" onChange={e => handleInputChange('price', e.target.value)} required />
             
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>addTopharmacy()} >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
    
  );
};

export default Medicine;

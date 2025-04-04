import React from 'react'
import './Carousel.css'
import {Carousel } from 'react-bootstrap';
import img1 from '../../../assets/4.jpg'
import img2 from '../../../assets/7.jpg';
import img3 from '../../../assets/5.jpg';
function Carusel() {
  return (
    <Carousel fade className='w-100'>
      <Carousel.Item className='img-slider w-100 '>
          <div className="d-flex flex-row justify-content-center align-items-center">
            <img src={img1} alt="" 
            // className='w-100'
               style={{ height: "296px", width: "313.53px" }}
            />
         </div>
      </Carousel.Item>
      <Carousel.Item className='img-slider w-100'>
      <div className="d-flex flex-row justify-content-center align-items-center">
        <img src={img2} alt=""
          // className='w-100'
          style={{ height: "296px", width: "313.53px" }}
        />
        </div>
      </Carousel.Item>
      <Carousel.Item className='img-slider w-100'>
      <div className="d-flex flex-row justify-content-center align-items-center">
      <img src={img3} alt=""  
      // className='w-100'
         style={{ height: "296px", width: "313.53px" }}
      />
        
        </div>
      </Carousel.Item>
    </Carousel>
      
    
  )
}

export default Carusel
import React from 'react'
// import { Container } from 'react-bootstrap'
import  './SubTitle.css'
// import { Link } from 'react-router-dom'
const SubTitle = ({title}) => {
  return (
       
           <div className="container d-flex justify-content-between pt-3 mb-3">
            <div className='text-title '>{title}</div>
              {/* { btnTitle ? <Link to={path}  className='btn-title py-1 px-3'>
            {btnTitle}
              </Link>
              :null           
                } */}
           </div>

  )
}

export default SubTitle
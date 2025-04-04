import React from 'react'
import { useGetFromCartQuery } from '../../redux/feature/api/categories/categoriesApi'
import { useParams } from 'react-router-dom'

const Cart = () => {
  const {data} =useGetFromCartQuery()
  data && console.log(data);
  
  return (
    <div>
      <h1>cart</h1>
    </div>
  )
}

export default Cart
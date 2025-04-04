import React from 'react'
import { useGetFromFavQuery } from '../../redux/feature/api/categories/categoriesApi'

const Favourite = () => {
  const {data} = useGetFromFavQuery()
  data && console.log(data);
  
  return (
    <div>Favourite</div>
  )
}

export default Favourite
import React, { useEffect, useState } from 'react'
import Medicine from './Medicine'
import { Container, Row } from 'react-bootstrap'
import { useGetDataQuery } from '../../redux/feature/api/categories/categoriesApi';
import Cookies from 'universal-cookie';


const Medicines = () => {
  const { data:pro, error, isLoading } = useGetDataQuery('products/products');
 pro && console.log('dataaaaa', pro);

  const [products,setProducts]=useState([])
  
//     useEffect(()=>{
 
//   const getdata= async ()=>{

//       const res= await axios.get('https://midiaid.onrender.com/api/products/products',
//         {
//           headers: {
//             'Authorization': `Bearer ${cookies.get('token')}`
//           }
//         }
//       )
//     console.log('product',res.data);
//     products &&   setProducts(res.data)
    
//   }
// getdata()
// },[])
  useEffect(() => {
    pro && setProducts(pro)

    console.log('dataaaaa', pro);
    
  }, [pro]);
  
  if (isLoading) return <p>جاري التحميل...</p>;
  if (error) return <p>حدث خطأ في جلب البيانات!</p>;


  return (
    
   <Container>
     <Row className='d-flex justify-content-center col-pro'>
      {  products && products?.map((medicine,i)=>(
          <Medicine key={i} medicine={medicine}/>
// console.log(medicine)

      ))}
     
   
     </Row>
   </Container>
  )
}

export default Medicines
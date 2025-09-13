import React, {useState, useEffect, useRef} from 'react'
import BaseGrnItemForm from './BaseGrnItemForm'
import { useAuthContext } from '../../../contexts/AuthContext';
import productHTTP from '../../../services/ProductService'

const onDateChange = (date, dateString) => {
  console.log(date, dateString);
};

const AddGrnItemForm = (props) => {
  const {
    form,
    handleSubmit,
    grnId
  } = props;
  const {token} = useAuthContext();
  const persistToken = useRef(token);
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async() => {
      try {
        const response = await productHTTP.get('all', {
          headers: {
            Authorization: `Bearer ${persistToken.current}`
          }
        });
        setProduct(response.data);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchProduct();
  }, [])

  return (
    <React.Fragment>
      <BaseGrnItemForm 
        form={form}
        handleSubmit={handleSubmit}
        product={product}
        onDateChange={onDateChange}
        mode="add"
        grnId={grnId} 
      />
    </React.Fragment>
  )
}

export default AddGrnItemForm
import React, {useState, useEffect, useRef} from 'react'
import BaseGrnItemForm from './BaseGrnItemForm'
import { useAuthContext } from '../../../contexts/AuthContext';
import productHTTP from '../../../services/ProductService'

const onDateChange = (date, dateString) => {
  console.log(date, dateString);
};

const EditGrnItemForm = (props) => {
    const {
        form,
        handleSubmit,
        grnItem
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [product, setProduct] = useState([]);

    // side effect for fetching all products
    useEffect(() => {
        const fetchProducts = async() => {
            try {
                const response = await productHTTP.get('all', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setProduct(response.data);
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        fetchProducts();
    }, [])

    return (
        <React.Fragment>
            <BaseGrnItemForm
                form={form}
                formName={`edit_grn_item_${grnItem.id}`}
                handleSubmit={handleSubmit}
                product={product}
                onDateChange={onDateChange}
                mode="update"
                grnId={grnItem?.grn?.id}
                grnItem={grnItem}
            />
        </React.Fragment>
    )
}

export default EditGrnItemForm
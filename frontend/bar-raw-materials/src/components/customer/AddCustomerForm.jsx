import React from 'react'
import BaseCustomerForm from './BaseCustomerForm';
import { useAuthContext } from '../../contexts/AuthContext';
import customerHTTP from '../../services/CustomerService'

const AddCustomerForm = (props) => {
  const {
    form,
    handleSubmitSuccess,
    handleSubmitFailure
  } = props;
  const {token} = useAuthContext();

  const handleSubmit = (values) => {
    const addCustomer = async() => {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(values)], {type: "application/json"}));
      try {
        const response = await customerHTTP.post('/add', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          const newCustomer = response.data;
          handleSubmitSuccess("Thêm khách hàng thành công", newCustomer);
        }
      }
      catch(error) {
        const responseErr = error.response;
        console.log(responseErr);
        handleSubmitFailure(responseErr.data);
      }
    }
    addCustomer();
  }

  return (
    <BaseCustomerForm
      form={form}
      formName="add_customer"
      handleSubmit={handleSubmit}
      mode="add"
      customerId={null}
      customer={null}
    />
  )
}

export default AddCustomerForm
import React, {useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {Form, DatePicker, Select, Input, Upload, Card, Button, message} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext'
import BaseGrnForm from './BaseGrnForm';
import vendorHTTP from '../../../services/VendorService'
import grnHTTP from '../../../services/GoodsReceiptNoteService'

const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const {Option} = Select;

const AddImportPaperForm = () => {
  const [vendor, setVendor] = useState([]);
  const [messageAPI, contextHolder] = message.useMessage();
  const {token} = useAuthContext();
  const persistToken = useRef(token);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const successMsg = (msg, grnId) => {
    messageAPI.open({
      type: 'success',
      content: msg,
      duration: 0.5,
      onClose: () => {
        navigate(`/import/add_grn/${grnId}/add_grn_item`);
      }
    })
  };

  const failMsg = (msg) => {
    messageAPI.open({
      type: 'error',
      content: msg,
      duration: 1
    })
  };

  const handleSubmit = (values) => {
    const addGrn = async() => {
      const formData = new FormData();
      // new uploaded image will contain `originFileObj` property
      const imageFile = values.image?.[0]?.originFileObj;
      // format date to ISO format
      if (values.invoiceDate) values.invoiceDate = values.invoiceDate.format("YYYY-MM-DD");
      if (values.dateReceived) values.dateReceived = values.dateReceived.format("YYYY-MM-DD");
      
      let data = {...values};

      if (imageFile) {
        formData.append('image', imageFile);
        // remove imageFile
        const {image:_, ...rest} = data;
        data = rest;
      }

      // append the rest of form values to 'data' object
      formData.append('data', new Blob([JSON.stringify(data)], {type: 'application/json'}));

      try {
        const response = await grnHTTP.post('/add', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });

        if (response.status === 200) {
          const responseData = response.data;
          form.resetFields();
          successMsg(responseData.successfulMsg, responseData.grnId);
        }
      }
      catch (e) {
        const responseData = e.response.data;
        if (responseData.duplicateInvoiceNumber) {
          form.setFields([
            {
              name: 'invoiceNumber',
              errors: [responseData.duplicateInvoiceNumber]
            }
          ])
        }
      }
    }
    addGrn();
  }

  useEffect(() => {
    const fetchVendor = async() => {
      const response = await vendorHTTP.get('/all', {
        headers: {
          Authorization: `Bearer ${persistToken.current}`
        }
      })
      setVendor(response.data);
    }
    fetchVendor();
  }, [])

  return (
    <React.Fragment>
      {contextHolder}
      <Card 
        title="Tạo phiếu nhập"
        style={{flex: 0.6}}
      >
        <BaseGrnForm
          form={form}
          handleSubmit={handleSubmit}
          vendor={vendor}
          onDateChange={onChange}
          normFile={normFile}
          mode="create"
        />
      </Card>
    </React.Fragment>
  )
}

export default AddImportPaperForm
import React, {useState, useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import {Form, DatePicker, Select, Input, Upload, Card, Button, message} from 'antd'
import { UploadOutlined } from '@ant-design/icons';
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
      values.invoiceDate?.format("YYYY-MM-DD");
      values.dateReceived?.format("YYYY-MM-DD");
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
        {/* <Form
          size="middle"
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          encType='multipart/form-data'
          onFinish={handleSubmit}
        >
            <Form.Item
              label="Nhà cung cấp"
              labelAlign='left'
              name="vendorId"
              rules={[{ required: true, message: "Nhà cung cấp không được để trống" }]}
            >
              <Select placeholder="Chọn nhà cung cấp">
                {vendor.map((vendor) => (
                  <Option key={vendor.id} value={vendor.id}>{vendor.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Người nhận"
              labelAlign='left'
              name="receivedBy"
              rules={[{ required: false }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Ngày nhận"
              labelAlign='left'
              name="dateReceived"
              rules={[{ required: false }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                size="middle" 
                onChange={onChange} 
                needConfirm 
              />
            </Form.Item>

            <Form.Item
              label="Số hóa đơn"
              labelAlign='left'
              name="invoiceNumber"
              rules={[{ required: true, message: 'Số hóa đơn không được để trống' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Ngày tạo hóa đơn"
              labelAlign='left'
              name="invoiceDate"
              rules={[{ required: true, message: 'Ngày tạo hóa đơn không được để trống' }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                size="middle" 
                onChange={onChange} 
                needConfirm 
              />
            </Form.Item>

            <Form.Item 
              label="Hình ảnh hóa đơn"
              labelAlign="left"
              name="image"
              valuePropName="fileList" 
              getValueFromEvent={normFile}
            >
              <Upload 
                beforeUpload={() => false} 
                listType="picture-card"
                maxCount={1}
                accept="image/*"
                name="image"
                style={{
                  width: '15rem',
                  height: '10rem'
                }}
              >
                <button
                  style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                  type="button"
                >
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Form.Item>
        </Form> */}
        <BaseGrnForm
          form={form}
          handleSubmit={handleSubmit}
          vendor={vendor}
          onChange={onChange}
          normFile={normFile}
          mode="create"
        />
      </Card>
    </React.Fragment>
  )
}

export default AddImportPaperForm
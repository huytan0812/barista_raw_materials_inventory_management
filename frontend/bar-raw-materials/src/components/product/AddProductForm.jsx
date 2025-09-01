import React, {useEffect, useState} from 'react'
import {Form, Input, Select, InputNumber, Upload} from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import {useAuthContext} from '../../contexts/AuthContext'

const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

const {Option} = Select;

const AddProductForm = (props) => {
  const [baseUnit, setBaseUnit] = useState([]);
  const [category, setCategory] = useState([]);
  const [form] = Form.useForm();

  const { token } = useAuthContext();
  const { isSubmit, onSubmitSuccess } = props;

  const onFinish = (values) => {
    // handle submission
    const submitData = async() => {
      try {
        const formData = new FormData();
        const imageFile = values.image?.[0]?.originFileObj;
        let data = {...values};

        if (imageFile) {
          formData.append('image', imageFile);
          // remove image in field values
          const {image, ...rest} = data;
          data = rest;
        }

        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

        const addProduct = await fetch("http://localhost:8080/api/staff/product/add",
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          }
        );

          if (addProduct.ok) {
            const data = await addProduct.json();
            console.log(data);
          }
          else {
            console.log("Error in adding new product");
          }
        }
        catch (error) {
          console.log(error);
        }
      }
    submitData();
  };

  // side effect for handling submit form
  useEffect(() => {
    if (isSubmit) {
      form.validateFields()
      .then((values) => {
        onFinish(values);
        onSubmitSuccess(`Sản phẩm ${values.name} đã được thêm thành công`);
        form.resetFields(); 
      })
     .catch(err => {
        console.log(err);
      })
    }
  }, [form, isSubmit, onSubmitSuccess]);

  // side effect for fetching base units
  useEffect(() => {
    const fetchUnits = async() => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/staff/baseUnit/list',
          {
            method: 'GET',
            'headers': {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        setBaseUnit(data.content);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchUnits();
  }, []);

  // side effects for fetching categories
  useEffect(() => {
    const fetchCategories = async() => {
      try {
        const response = await fetch("http://localhost:8080/api/staff/category/list", {
          method: 'GET',
          'headers': {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setCategory(data.content);
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      // onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      encType='multipart/form-data'
    >
        <Form.Item
          label="SKU"
          labelAlign='left'
          name="sku"
          rules={[{ required: true, message: "Nhập SKU" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Sản phẩm"
          labelAlign='left'
          name="name"
          rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Đơn vị tính"
          labelAlign='left'
          name="baseUnitId"
          rules={[{ required: true, message: 'Đơn vị tính không được để trống' }]}
        >
          <Select name="unit" placeholder="Chọn đơn vị tính">
            {baseUnit.map((unit) => (
              <Option key={unit.id} value={unit.id}>{unit.name}-{unit.notation}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Khối lượng tịnh / thể tích thực"
          labelCol={16}
          wrapperCol={24}
          labelAlign='left'
          name="packSize"
          rules={[{ required: true, message: 'Khối lượng tịnh / thể tích thực không được để trống' }]}
        >
          <InputNumber
            min={0.0}
            step={0.1}
            style={{
              float: 'right', 
              width: '100%',
              fontSize: '2.4rem'
            }}
            size="middle"
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          labelAlign="left"
          name="description"
          rules={[{ required: false}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          labelAlign="left"
          name="categoryId"
          rules={[{required: true, message: 'Chọn danh mục'}]}
        >
          <Select placeholder="Chọn danh mục">
            {category.map(ctg => (
              <Option key={ctg.id} value={ctg.id}>{ctg.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Hình ảnh"
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

        <Form.Item
          label="Giá bán niêm yết"
          labelCol={12}
          wrapperCol={24}
          labelAlign="left"
          name="listPrice"
          rules={[{ required: true, message: 'Nhập giá bán niêm yết' }]}
        >
          <InputNumber
            min={0}
            style={{
              float: 'right',
              fontSize: '2.4rem',
              width: '100%'
            }}
            size="middle"
          />
        </Form.Item>
    </Form>
  )
}

export default AddProductForm
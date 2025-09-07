import React, {useEffect, useState, useCallback, useRef} from 'react'
import {Form, Input, Select, InputNumber, Upload} from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import {useAuthContext} from '../../contexts/AuthContext'
import axiosHTTP from '../../services/ProductService'

// Form hook use normFile for image field
// as the resource of truth
const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const {Option} = Select;

const EditProductForm = (props) => {
  const [baseUnit, setBaseUnit] = useState([]);
  const [category, setCategory] = useState([]);
  const [form] = Form.useForm();

  const { token } = useAuthContext();
  const { isSubmit, onSubmitSuccess, productId } = props;
  const persistToken = useRef(token);

  const uploadConfig = {
    beforeUpload: () => false, 
    listType: "picture-card",
    maxCount: 1,
    accept: "image/*",
    name: "image",
  }

  const onFinish = useCallback((values, form) => {
    // handle submission
    const submitData = async() => {
      try {
        const formData = new FormData();
        // originFileObj only appears if new image is uploaded
        const imageFile = values.image?.[0]?.originFileObj;
        let data = {...values};

        if (imageFile) {
          formData.append('image', imageFile);
        }

        // remove image in field values
        const {image:_, ...rest} = data;
        data = rest;

        // if image already exists
        if (values.image != null && values.image.length != 0) {
          data.imageName = values.image[0].name;
          console.log("Image file name:", data.imageName);
        }

        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

        console.log("Form data:", values);
        console.log("Form data after removing image:", data);

        const response = await fetch(`http://localhost:8080/api/staff/product/update/${productId}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          }
        );
          const responseData = await response.json();
          if (response.ok) {
            console.log(responseData);
            onSubmitSuccess(`Sản phẩm ${values.name} đã được cập nhật thành công`);
          }
          else {
            console.log("Response data:", responseData);
            const errorMsg = responseData?.errorMsg || "Có lỗi xảy ra";
            form.setFields(
              [
                {
                  name: 'sku',
                  errors: [errorMsg],
                },
              ]
            )
          }
        }
        catch (error) {
          console.log(error);
        }
      }
    submitData();
  }, [onSubmitSuccess, token, productId]);

  // side effect for fetching product form fields
  const populatingFormData = async() => {
    const response = await axiosHTTP.get(`/details/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const product = response.data;
    console.log(product);
    form.setFieldsValue({
      'sku': product.sku,
      'name': product.name,
      'baseUnitId': product.baseUnit.id,
      'packSize': product.packSize,
      'description': product.description,
      'categoryId': product.category.id,
      'image': product.imageName != null ? [
        {
          uid: String(product.id),
          name: product.imageName,
          status: "done",
          url: `http://localhost:8080/api/image/product/${product.imageName}`,
        },
      ] : null,
      'listPrice': product.listPrice
    });
  }
  useEffect(() => {
    populatingFormData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // side effect for handling submit form
  useEffect(() => {
    if (isSubmit) {
      // form.validateFields() is used for validate base on the `rules` array in Form.Item
      form.validateFields()
      .then((values) => {
        onFinish(values, form);
      })
     .catch(err => {
        console.log(err);
      })
    }
  }, [form, isSubmit, onSubmitSuccess, onFinish]);

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
              'Authorization': `Bearer ${persistToken.current}`
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
            'Authorization': `Bearer ${persistToken.current}`
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
      name={`update_product_${productId}`}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
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
          // value from normFile will be injected to the fileList property of Upload component
          valuePropName="fileList" 
          getValueFromEvent={normFile}
        >
          <Upload 
            {...uploadConfig}
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

export default EditProductForm
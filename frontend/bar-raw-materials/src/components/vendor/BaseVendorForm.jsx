import React, {useEffect, useState, useRef} from 'react'
import {Form, Input, Select, Upload} from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import {useAuthContext} from '../../contexts/AuthContext'

const businessLicenseNormFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const foodSafetyCertNormFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const {Option} = Select;

const BaseVendorForm = (props) => {
  const { token } = useAuthContext();
  const persistToken = useRef(token);

  const { 
    handleSubmit,
    mode,
    form,
    formName 
  } = props;

  console.log(mode);

  return (
    <Form
      form={form}
      name={formName}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 32 }}
      style={{ maxWidth: 966 }}
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      autoComplete="off"
      encType='multipart/form-data'
    >
        <Form.Item
          label="Tên nhà cung cấp"
          labelAlign='left'
          name="name"
          rules={[{ required: true, message: "Nhập tên nhà cung cấp" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mã số thuế"
          labelAlign='left'
          name="taxCode"
          rules={[{ required: true, message: 'Nhập mã số thuế' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          labelAlign='left'
          name="phoneNumber"
          rules={[{ required: true, message: 'Nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          labelAlign='left'
          name="email"
          rules={[{ required: true, message: 'Nhập email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label="Ảnh giấy đăng ký kinh doanh"
          labelAlign="left"
          name="businessImage"
          valuePropName="fileList" 
          getValueFromEvent={businessLicenseNormFile}
        >
          <Upload 
            beforeUpload={() => false} 
            listType="picture-card"
            maxCount={1}
            accept="image/*"
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
          label="Ảnh giấy vệ sinh ATTP"
          labelAlign="left"
          name="foodSafetyCertImage"
          valuePropName="fileList" 
          getValueFromEvent={foodSafetyCertNormFile}
        >
          <Upload 
            beforeUpload={() => false} 
            listType="picture-card"
            maxCount={1}
            accept="image/*"
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
    </Form>
  )
}

export default BaseVendorForm
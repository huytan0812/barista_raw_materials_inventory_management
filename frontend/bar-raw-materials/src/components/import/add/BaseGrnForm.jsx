import React from 'react'
import {Form, Input, Select, DatePicker, Upload, Button} from 'antd'
import { UploadOutlined } from '@ant-design/icons';

const {Option} = Select;

const BaseGrnForm = (props) => {
    const {
        form,
        handleSubmit,
        vendor,
        onDateChange,
        normFile 
    } = props;

    return (
        <Form
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
                onChange={onDateChange} 
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
                onChange={onDateChange} 
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
        </Form>
    )
}

export default BaseGrnForm
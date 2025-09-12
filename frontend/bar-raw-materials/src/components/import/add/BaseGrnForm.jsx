import React from 'react'
import {Form, Input, Select, DatePicker, Upload, Button} from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import dayjs from "dayjs"

const {Option} = Select;

const BaseGrnForm = (props) => {
    const {
        form,
        handleSubmit,
        vendor,
        onDateChange,
        normFile,
        mode,
        grn 
    } = props;

    console.log("Mode:", mode);
    if (mode === "update") {
        form.setFieldsValue({
            'id': grn?.id,
            'vendorId': grn?.vendor?.id,
            'receivedBy': grn?.receivedBy,
            'dateReceived': grn?.dateReceived ? dayjs(grn.dateReceived) : null,
            'invoiceNumber': grn?.invoiceNumber,
            'invoiceDate': grn?.invoiceDate ? dayjs(grn.invoiceDate) : null,
            'image': grn?.invoiceImage ? [
                {
                    uid: String(grn?.id),
                    name: grn?.invoiceImage,
                    status: "done",
                    url: `http://localhost:8080/api/image/vendor/${grn?.invoiceImage}`,
                },
            ] : null
        })
    }

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
            {mode==="update" && 
            <Form.Item label="Hidden Field" name="id" hidden={true}>
                <Input />
            </Form.Item>
            }
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

            {
                mode!=="update" &&
                <Form.Item label={null}>
                    {/* submit button in AntD Form component will automatically
                        trigger onFinish event and pass the form values to the onFinish event handler
                    */}
                    <Button type="primary" htmlType="submit">
                        Xác nhận
                    </Button>
                </Form.Item> 
            }
        </Form>
    )
}

export default BaseGrnForm
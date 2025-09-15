import React, {useEffect} from 'react'
import {Form, Input, Select, DatePicker, InputNumber} from 'antd'
import dayjs from "dayjs"

const {Option} = Select;

const BaseGrnItemForm = (props) => {
    const {
        form,
        formName,
        handleSubmit,
        product,
        onDateChange,
        mode,
        grnId,
        grnItem 
    } = props;

    useEffect(() => {
        if (mode === "update" && grnItem) {
            form.setFieldsValue({
                'id': grnItem?.id,
                'productId': grnItem?.product?.id,
                'quantityImport': grnItem?.quantityImport,
                'unitCost': grnItem?.unitCost,
                'lotNumber': grnItem?.lotNumber,
                'mfgDate': grnItem?.mfgDate ? dayjs(grnItem.mfgDate) : null,
                'expDate': grnItem?.expDate ? dayjs(grnItem.expDate) : null,
                'vatRate': grnItem?.vatRate ? grnItem.vatRate * 100 : null,
            });
        }
    }, [form, grnItem, mode]);

    return (
        <Form
            size="middle"
            form={form}
            name={formName}
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
                label="Hidden Field" 
                name="grnId" 
                hidden={true}
                initialValue={grnId}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Sản phẩm"
                labelAlign='left'
                name="productId"
                rules={[{ required: true, message: "Sản phẩm không được để trống" }]}
            >
                <Select 
                    placeholder="Chọn sản phẩm"
                    showSearch
                    optionFilterProp="children" // search against the option text
                    filterOption={(input, option) =>
                        option?.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                {product.map((product) => (
                    <Option key={product.productId} value={product.productId}>{product.name}</Option>
                ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Số lượng nhập"
                labelAlign="left"
                name="quantityImport"
                rules={[{ required: true, message: 'Số lượng nhập không được bỏ trống' }]}
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

            <Form.Item
                label="Đơn giá nhập"
                labelAlign="left"
                name="unitCost"
                rules={[{ required: true, message: 'Đơn giá nhập không được bỏ trống' }]}
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

            <Form.Item
                label="Mã số lô"
                labelAlign='left'
                name="lotNumber"
                rules={[{ required: true, message: 'Mã số lô không được để trống' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Ngày sản xuất"
                labelAlign='left'
                name="mfgDate"
                rules={[{ required: true, message: 'Ngày sản xuất đơn không được để trống' }]}
            >
                <DatePicker
                    format="DD/MM/YYYY"
                    size="middle" 
                    onChange={onDateChange} 
                    needConfirm 
                />
            </Form.Item>

            <Form.Item
                label="Hạn sử dụng"
                labelAlign='left'
                name="expDate"
                rules={[{ required: true, message: 'Hạn sử dụng không được để trống' }]}
            >
                <DatePicker
                    format="DD/MM/YYYY"
                    size="middle" 
                    onChange={onDateChange} 
                    needConfirm 
                />
            </Form.Item>

            <Form.Item
                label="VAT đầu vào (%)"
                labelCol={12}
                wrapperCol={24}
                labelAlign="left"
                name="vatRate"
                rules={[{ required: true, message: 'VAT đầu vào không được bỏ trống' }]}
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

export default BaseGrnItemForm
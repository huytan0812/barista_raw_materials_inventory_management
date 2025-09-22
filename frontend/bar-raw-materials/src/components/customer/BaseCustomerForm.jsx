import React, {useState, useEffect, useRef} from 'react'
import {Form, Input} from 'antd'
import { useAuthContext } from '../../contexts/AuthContext'

const BaseCustomerForm = (props) => {
    const {
        form,
        formName,
        handleSubmit,
        mode,
        customerId,
        customer 
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={handleSubmit}
        >
            <Form.Item
                label="Tên khách hàng"
                labelAlign='left'
                name="name"
                rules={[{ required: true, message: 'Tên khách hàng không được để trống' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Số điện thoại"
                labelAlign='left'
                name="phoneNumber"
                rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}
            >
                <Input />
            </Form.Item>
        </Form>
    )
}

export default BaseCustomerForm
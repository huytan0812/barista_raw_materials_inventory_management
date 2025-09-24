import React from 'react'
import {Form, Input} from 'antd'

const EditExpItemForm = (props) => {
    const {
        form,
        expItem,
        quantityRemain,
        handleSubmit
    } = props;
    return (
        <Form
            form={form}
            name={`edit_exp_item_form_${expItem.id}`}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={handleSubmit}
        >
            <Form.Item
                label="Mã số lô"
                labelAlign='left'
                name="lotNumber"
                rules={[{ required: true, message: 'Mã số lô không được để trống' }]}
                initialValue={expItem.lotNumber}
                disabled={true}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="SLCL"
                labelAlign='left'
                name="quantityRemain"
                initialValue={quantityRemain}
            >
                <InputNumber 
                    min={0}
                    style={{
                        float: 'right',
                        fontSize: '2.4rem',
                        width: '100%'
                    }}
                    size="middle"
                    disabled={true}
                />
            </Form.Item>
            <Form.Item
                label="Số lượng lấy ra"
                labelAlign='left'
                name="quantityTake"
                initialValue={expItem.quantityTake}
                rules={[
                    { required: true, message: "Số lượng lấy ra không được để trống" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || value <= quantityRemain) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error("Số lượng lấy ra không được lớn hơn SLCL")
                            );
                        },
                    }),
                ]}
            >
                <InputNumber 
                    min={0}
                    style={{
                        float: 'right',
                        fontSize: '2.4rem',
                        width: '100%'
                    }}
                    size="middle"
                    disabled={true}
                />
            </Form.Item>
        </Form>
    )
}

export default EditExpItemForm
import React from 'react'
import {Form, Input, InputNumber} from 'antd'

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
            labelCol={{ span: 8 }}
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
            >
                <Input
                    disabled={true}
                />
            </Form.Item>
            <Form.Item
                label="SLCL"
                labelAlign='left'
                name="quantityRemain"
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
                label="Số lượng lấy ra trước đó"
                labelAlign='left'
                name="quantityTakeBefore"
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
                rules={[
                    { required: true, message: "Số lượng lấy ra không được để trống" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || value <= quantityRemain + expItem.quantityTake) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error("Số lượng lấy ra không được lớn hơn tổng SLCL và số lượng lấy ra trước đó")
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
                />
            </Form.Item>
        </Form>
    )
}

export default EditExpItemForm
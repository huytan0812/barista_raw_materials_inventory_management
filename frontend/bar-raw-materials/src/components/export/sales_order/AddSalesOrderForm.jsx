import React, {useState, useRef} from 'react'
import {Form, Input, Select, Space, Button, Modal, Card, message} from 'antd'
import { useNavigate } from 'react-router-dom';
import AddCustomerForm from '../../customer/AddCustomerForm';
import { useAuthContext } from '../../../contexts/AuthContext'
import salesOrderHTTP from '../../../services/SalesOrderService'

const {Option} = Select;

const AddSalesOrderForm = (props) => {
    const {
        addSalesOrderForm,
        customers
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const navigate = useNavigate();

    // states for handling Modal
    const [openAddCustomerForm, setOpenAddCustomerForm] = useState(false);
    // states for handling AddCustomerForm
    const [addCustomerForm] = Form.useForm();
    // states for handling message
    const [messageApi, contextHolder] = message.useMessage();
    const popUpMsg = (type, msg) => {
        messageApi.open({
            type: type,
            content: msg
        })
    };
    const successMsgAndNavigation = (msg, salesOrderId) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 0.25,
            onClose: () => {
                navigate(`/export/add_sales_order/${salesOrderId}/add_item`);
            }
        })
    }

    // event handlers for adding new customer
    const handleAddCustomer = () => {
        setOpenAddCustomerForm(true);
    }
    const handleAddCustomerSuccess = (msg, newCustomer) => {
        popUpMsg('success', msg);
        addCustomerForm.resetFields();
        setOpenAddCustomerForm(false);

        // update the customers list
        customers.push(newCustomer);
        // set customer in the add sales order form with the newly added customer
        addSalesOrderForm.setFieldsValue({
            'customerId': newCustomer?.id
        })
    }
    const handleAddCustomerFailure = (responseErr) => {
        if (responseErr?.duplicatedPhoneNumber) {
            addCustomerForm.setFields([
                {
                    name: 'phoneNumber',
                    errors: [responseErr.duplicatedPhoneNumber]
                }
            ]);
        }
        popUpMsg('error', "Có lỗi xảy ra");

    }

    const handleOk = () => {
        addCustomerForm.submit();
    }
    const handleCancel = () => {
        addCustomerForm.resetFields();
        setOpenAddCustomerForm(false);
    }

    // event handler for adding new Sales Order
    const handleSubmitSalesOrderForm = (values) => {
        const addSalesOrder = async() => {
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(values)], {type: 'application/json'}));
            try {
                const response = await salesOrderHTTP.post('/add', formData, {
                headers: {
                    Authorization: `Bearer ${persistToken.current}`,
                    'Content-Type': 'multipart/form-data'
                }
                });
                if (response.status === 200) {
                    const salesOrder = response.data;
                    successMsgAndNavigation("Thêm phiếu xuất kho thành công", salesOrder?.id);
                }
            }
            catch(error) {
                console.log(error);
                popUpMsg('error', "Có lỗi xảy ra");
            }
        }
        addSalesOrder();
    }

    return (
        <React.Fragment>
            {contextHolder}
            <Card
                title="Tạo phiếu xuất"
                style={{flex: 0.6}}
            >
                <Form
                    form={addSalesOrderForm}
                    name="add_sales_order"
                    onFinish={handleSubmitSalesOrderForm}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Thêm khách hàng mới"
                    >
                        <Button 
                            color="primary"
                            variant="outlined"
                            onClick={handleAddCustomer}
                        >
                            Thêm
                        </Button>
                        <Modal
                            open={openAddCustomerForm}
                            destroyOnHidden={true}
                            title="Thêm khách hàng"
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="back" onClick={handleCancel}>
                                    Hủy
                                </Button>,
                                <Button key="submit" type="primary" onClick={handleOk}>
                                    Xác nhận
                                </Button>
                            ]}
                        >
                            <AddCustomerForm
                                form={addCustomerForm}
                                handleSubmitSuccess={handleAddCustomerSuccess}
                                handleSubmitFailure={handleAddCustomerFailure}
                            />
                        </Modal>
                    </Form.Item>
                    <Form.Item
                        label="Khách hàng đã tạo"
                        labelAlign='left'
                        name="customerId"
                        rules={[{ required: true, message: "Khách hàng không được để trống" }]}
                    >
                        <Select 
                            placeholder="Chọn khách hàng"
                            showSearch
                            optionFilterProp="phone"  // search by phone
                            filterOption={(input, option) =>
                                option?.phone?.toLowerCase().includes(input.toLowerCase())
                            }
                            allowClear
                        >
                            {customers.map((customer) => (
                                <Option 
                                    key={customer.id} 
                                    value={customer.id}
                                    phone={customer.phoneNumber}
                                >
                                    {customer.name==="GUESS" ? "Khách vãng lai" : customer.name} - {customer.phoneNumber}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Xác nhận
                        </Button>
                    </Form.Item> 
                </Form>
            </Card>
        </React.Fragment>
    )
}

export default AddSalesOrderForm
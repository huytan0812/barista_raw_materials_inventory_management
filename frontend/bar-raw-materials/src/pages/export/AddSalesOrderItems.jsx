import React, {useState, useEffect, useRef} from 'react'
import {Card, Breadcrumb, Button, Pagination, Form, Modal, message} from 'antd'
import {useParams, NavLink} from 'react-router-dom'
import SalesOrderItems from '../../components/export/sales_order_items/SalesOrderItems'
import { useAuthContext } from '../../contexts/AuthContext'
import salesOrderHTTP from '../../services/SalesOrderService'
import salesItemHTTP from '../../services/SalesOrderItemService'
import AddSalesItemForm from '../../components/export/sales_order_items/AddSalesItemForm'

const AddSalesOrderItems = () => {
    const params = useParams();
    const salesOrderId = params.salesOrderId;
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    // states for handling fetching SalesOrder
    const [salesOrder, setSalesOrder] = useState({});
    // states for handling SalesOrderItem
    const [salesItem, setSalesItem] = useState({});

    // states for handling open AddSalesItemForm Modal and AddSalesItemForm
    const [open, setOpen] = useState(false);
    const [addSalesItemForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    // states for handling pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const PAGE_SIZE = 5;

    const popUpMsg = (type, msg) => {
        messageApi.open({
            type: type,
            content: msg
        });
    }

    const handleAddSalesItem = () => {
        const createSalesItem = async() => {
            try {
                const response = await salesItemHTTP.get(`/salesOrder/${salesOrderId}/createSaleItem`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setSalesItem(response.data);
                    setOpen(true);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        createSalesItem();
    };
    const handleOk = () => {
        addSalesItemForm.submit();
    };
    const handleCancel = () => {
        addSalesItemForm.resetFields();
        setOpen(false);
    };

    // event handlers for handling AddSalesItemForm submission
    const handleSubmitSuccess = (msg) => {
        popUpMsg('success', msg);
        addSalesItemForm.resetFields();
        setOpen(false);
    }
    const handleSubmitFailure = (msg) => {
        popUpMsg('error', msg);
    }

    useEffect(() => {
        const fetchSalesOrder = async() => {
            try {
                const response = await salesOrderHTTP.get(`/details/${salesOrderId}`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setSalesOrder(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchSalesOrder();
    }, [salesOrderId]);

    return (
        <React.Fragment>
            <div>
                <Breadcrumb 
                items={
                    [ {
                        title:  (<NavLink to="/export">
                                    <span>Nhập kho</span>
                                </NavLink>)
                    },
                    {
                        title: (<NavLink to="/export/add_sales_order">
                                    <span>Tạo phiếu xuất</span>
                                </NavLink>)
                    },
                    {
                        title: "Thêm hàng bán"
                    }
                    ]
                }
                />
            </div>
            {contextHolder}
            <Card
                title={
                    <h3 style={{textAlign: 'center'}}>Phiếu xuất kho</h3>
                }
            >
                <Card
                    title={`Khách hàng: ${salesOrder?.customerName} - SĐT: ${salesOrder?.customerPhoneNumber}`}
                    extra={(
                        <React.Fragment>
                            <Button
                                type="primary"
                                onClick={handleAddSalesItem}
                            >
                                Thêm hàng bán
                            </Button>
                            <Modal
                                open={open}
                                destroyOnHidden={true}
                                title="Thêm hàng bán"
                                onOk={handleOk}
                                onCancel={handleCancel}
                                footer={[
                                    <Button key="back" onClick={handleCancel}>
                                        Hủy
                                    </Button>
                                    ,
                                    <Button key="submit" type="primary" onClick={handleOk}>
                                        Xác nhận
                                    </Button>
                                ]}
                                style={{
                                    width: '840px'
                                }}
                                >
                                    <AddSalesItemForm
                                        salesOrderId={salesOrderId}
                                        salesItem={salesItem}
                                        form={addSalesItemForm}
                                        onSubmitSuccess={handleSubmitSuccess}
                                        onSubmitFailure={handleSubmitFailure}
                                    />
                            </Modal>
                        </React.Fragment>
                    )}
                    style={{
                        marginTop: '0.8rem'
                    }}
                >
                    <SalesOrderItems
                        salesOrderId={salesOrderId}
                        setPageMetadata={setPageMetadata}
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                    />
                    <div style={{ textAlign: "right", marginTop: 16 }}>
                        <Pagination
                            current={currentPage}
                            pageSize={PAGE_SIZE}
                            total={pageMetadata.page?.totalElements || 0}
                            onChange={(page) => setCurrentPage(page)}
                            showTotal={(total) => `Hiện đang có ${total} phiếu xuất kho`}
                        />
                    </div>
                </Card>
            </Card>
        </React.Fragment>
    )
}

export default AddSalesOrderItems
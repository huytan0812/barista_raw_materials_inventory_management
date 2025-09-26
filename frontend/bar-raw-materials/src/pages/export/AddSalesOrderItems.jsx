import React, {useState, useEffect, useRef} from 'react'
import {Card, Row, Col, Breadcrumb, Button, Pagination, Form, Modal, message} from 'antd'
import {useParams, NavLink, useNavigate} from 'react-router-dom'
import SalesOrderItems from '../../components/export/sales_order_items/SalesOrderItems'
import { useAuthContext } from '../../contexts/AuthContext'
import salesOrderHTTP from '../../services/SalesOrderService'
import salesItemHTTP from '../../services/SalesOrderItemService'
import AddSalesItemForm from '../../components/export/sales_order_items/AddSalesItemForm'
import CancelSalesOrderModal from '../../components/export/sales_order/CancelSalesOrderModal'
import ConfirmSalesOrderModal from '../../components/export/sales_order/ConfirmSalesOrderModal'

const AddSalesOrderItems = () => {
    const params = useParams();
    const salesOrderId = params.salesOrderId;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const navigate = useNavigate();

    // states for handling fetching SalesOrder
    const [salesOrder, setSalesOrder] = useState({});
    // states for handling SalesOrderItem
    const [salesItem, setSalesItem] = useState({});
    const [refreshSaleItems, setRefreshSaleItems] = useState(false);

    // states for handling open AddSalesItemForm Modal and AddSalesItemForm
    const [open, setOpen] = useState(false);
    const [addSalesItemForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    // states for handling pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const PAGE_SIZE = 5;

    // state for handling Confirm Sales Order modal
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    // state for handling Delete Sales Order modal
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

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
        const deleteSalesItem = async() => {
            try {
                const response = await salesItemHTTP.get(`/delete/${salesItem.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    popUpMsg('success', "Đơn hàng bán được hủy thành công");
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        deleteSalesItem();
        setOpen(false);
    };

    // event handlers for handling AddSalesItemForm submission
    const handleSubmitSuccess = (msg) => {
        popUpMsg('success', msg);
        addSalesItemForm.resetFields();
        setOpen(false);
        setSalesItem(null);
        // refresh Sale Items table after creating a new Sales Order Item successfully
        setRefreshSaleItems(prev=>!prev);
    }
    const handleSubmitFailure = (msg) => {
        popUpMsg('error', msg);
    }

    // side effect for fetching Sales Order
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

    // event handlers for handling Sales Order confirmation
    const handleConfirmSalesOrder = () => {
        setOpenConfirmModal(true);
    }
    const handleConfirmSuccess = (msg) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 0.5,
            onClose: () => {
                navigate(`/export/salesOrder/${salesOrderId}`);
            }
        });
    }

    // event handler for handling cancel sales order
    const handleCancelSalesOrder = () => {
        setOpenDeleteModal(true);
    };
    const handleCancelSalesOrderSuccess = (msg) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 0.25,
            onClose: () => {
                navigate('/export');
            }
        });
    }

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
                                width={768}
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
                        popUpMsg={popUpMsg}
                        salesOrderId={salesOrderId}
                        setPageMetadata={setPageMetadata}
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        refreshSaleItems={refreshSaleItems}
                        setRefreshSaleItems={setRefreshSaleItems}
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
                <Row 
                    justify="end" 
                    gutter={8}
                    style={{
                        marginTop: '0.8rem',
                        paddingRight: '2rem'
                    }}
                >
                    <Col>
                        <Button
                            color="red"
                            variant="solid"
                            onClick={handleCancelSalesOrder}
                        >
                            Hủy phiếu
                        </Button>
                        <CancelSalesOrderModal
                            salesOrderId={salesOrder.id}
                            popUpMsg={popUpMsg}
                            onCancelSuccess={handleCancelSalesOrderSuccess}
                            open={openDeleteModal}
                            setOpen={setOpenDeleteModal}
                        />
                    </Col>
                    <Col>
                        <Button 
                            color="green" 
                            variant="solid"
                            onClick={handleConfirmSalesOrder}
                        >
                            Duyệt phiếu
                        </Button>
                        <ConfirmSalesOrderModal
                            salesOrderId={salesOrder.id}
                            popUpMsg={popUpMsg}
                            onConfirmSuccess={handleConfirmSuccess}
                            open={openConfirmModal}
                            setOpen={setOpenConfirmModal}
                        />
                    </Col>
                </Row>
            </Card>
        </React.Fragment>
    )
}

export default AddSalesOrderItems
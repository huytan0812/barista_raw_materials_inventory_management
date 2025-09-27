import React, {useState, useEffect, useRef} from 'react'
import { Breadcrumb, Card, Pagination, Row, Col, Button, message } from 'antd'
import {useParams, NavLink} from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import ConfirmSalesOrderItems from '../../components/export/sales_order/ConfirmSalesOrderItems'
import salesOrderHTTP from '../../services/SalesOrderService'

const SalesOrderDetails = () => {
    const params = useParams();
    const salesOrderId = params.salesOrderId;
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    const [messageApi, contextHolder] = message.useMessage();
    const [salesOrder, setSalesOrder] = useState({});
    // Sales Order Items pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const PAGE_SIZE = 5;

    const successMsg = (msg) => {
        messageApi.open({
            type: 'success',
            content: msg
        })
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

    const handleExportSalesOrder = () => {
        const exportSalesOrder = async() => {
            try {
                const response = await salesOrderHTTP.get(`/export-sales-order-pdf/${salesOrderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: "blob", // very important
                });

                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `phieu-xuat-kho-${salesOrderId}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                successMsg("Phiếu xuất kho được xuất thành công");
            } catch (error) {
                console.error("Export PDF failed", error);
            }
        }
        exportSalesOrder();
    }

    const handleExportSalesInvoice = () => {
        const exportSalesInvoice = async() => {
            try {
                const response = await salesOrderHTTP.get(`/export-sales-invoice-pdf/${salesOrderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: "blob", // very important
                });

                // Create blob link to download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `hoa-don-ban-hang-${salesOrderId}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                successMsg("Hóa đơn bán hàng được xuất thành công");
            } catch (error) {
                console.error("Export PDF failed", error);
            }
        }
        exportSalesInvoice();
    }

    return (
        <React.Fragment>
            <div>
                <Breadcrumb 
                items={
                    [ {
                        title:  (<NavLink to="/export">
                                    <span>Xuất kho</span>
                                </NavLink>)
                    },
                    {
                        title: `Chi tiết phiếu xuất kho có mã só ${salesOrderId}` 
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
                    style={{
                        marginTop: '0.8rem'
                    }}
                    extra={
                        <React.Fragment>
                            <Button
                                color="primary"
                                variant='solid'
                                onClick={handleExportSalesOrder}
                                style={{
                                    marginRight: '0.8rem'
                                }}
                            >
                                Xuất phiếu
                            </Button>
                            <Button
                                color="primary"
                                variant='solid'
                                onClick={handleExportSalesInvoice}
                            >
                                Xuất hóa đơn
                            </Button>
                        </React.Fragment>
                    }
                >
                    <ConfirmSalesOrderItems
                        salesOrderId={salesOrderId}
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        setPageMetadata={setPageMetadata}
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
              <Row>
                <Col
                  style={{ textAlign: 'right' }}
                >
                    <p>
                      Tổng số tiền khách hàng phải thanh toán: <span> </span> 
                      {
                        new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(salesOrder?.totalAmount)
                      }
                    </p>
                </Col>
              </Row>
            </Card>
        </React.Fragment>
    )
}

export default SalesOrderDetails
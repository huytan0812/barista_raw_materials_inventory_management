import React, {useState, useEffect, useRef} from 'react'
import { Breadcrumb, Card, Pagination, Row, Col } from 'antd'
import {useParams, NavLink} from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import ConfirmSalesOrderItems from '../../components/export/sales_order/ConfirmSalesOrderItems'
import salesOrderHTTP from '../../services/SalesOrderService'

const SalesOrderDetails = () => {
    const params = useParams();
    const salesOrderId = params.salesOrderId;
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    const [salesOrder, setSalesOrder] = useState({});
    // Sales Order Items pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const PAGE_SIZE = 5;

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
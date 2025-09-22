import React, {useState, useEffect, useRef} from 'react'
import {Card, Breadcrumb, Button} from 'antd'
import {useParams, NavLink} from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import salesOrderHTTP from '../../services/SalesOrderService'

const AddSalesOrderItems = () => {
    const params = useParams();
    const salesOrderId = params.salesOrderId;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [salesOrder, setSalesOrder] = useState({});

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
            <Card
                title={
                    <h3 style={{textAlign: 'center'}}>Phiếu xuất kho</h3>
                }
            >
                <Card
                    title={`Khách hàng: ${salesOrder?.customerName} - SĐT: ${salesOrder?.customerPhoneNumber}`}
                    extra={(
                        <Button
                            type="primary"
                        >
                            Thêm hàng bán
                        </Button>
                    )}
                    style={{
                        marginTop: '0.8rem'
                    }}
                >

                </Card>
            </Card>
        </React.Fragment>
    )
}

export default AddSalesOrderItems
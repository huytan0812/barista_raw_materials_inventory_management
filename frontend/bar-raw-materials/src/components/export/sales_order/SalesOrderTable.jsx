import React, {useState, useEffect, useRef} from 'react'
import {Table, Flex, Button, Tag} from 'antd'
import { useNavigate } from 'react-router-dom'
import {useAuthContext} from '../../../contexts/AuthContext'
import salesOrderHTTP from '../../../services/SalesOrderService'

const SalesOrderTable = (props) => {
    const {
        currentPage,
        pageSize,
        setPageMetadata
    } = props;

    const [salesOrders, setSalesOrders] = useState([]);
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const navigate = useNavigate();

    const handleClickWatchDetails = (salesOrderId) => {
        navigate(`/export/salesOrder/${salesOrderId}`);
    }

    useEffect(() => {
        const fetchSalesOrders = async() => {
            try {
                const response = await salesOrderHTTP.get('/list', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setSalesOrders(response.data.content);
                    const { content: _, ...rest } = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchSalesOrders();
    }, [currentPage, pageSize])

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1,
            align: "center"
        },
        {
            title: "Mã phiếu",
            dataIndex: "id",
            key: "id",
            align: "center"
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customerName",
            align: "center"
        },
        {
            title: "Ngày tạo",
            dataIndex: "dateCreated",
            key: "dateCreated",
            render: (value) => {
                return new Intl.DateTimeFormat("vn-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }).format(new Date(value));
            },
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Người tạo",
            dataIndex: "createdByUser",
            key: "createdByUser",
            align: "center"
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => {
                return (
                  <Flex gap="1rem" align="center" justify="center">
                    <Button 
                        color="blue" 
                        variant="solid" 
                        onClick={() => handleClickWatchDetails(record.id)}
                    >
                        <span style={{fontSize: '1.4rem'}}>Chi tiết</span>
                    </Button>
                  </Flex>
                )
            }
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={salesOrders?.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default SalesOrderTable
import React, {useState, useEffect, useRef} from 'react'
import {Table, Flex, Button} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext'
import salesItemHTTP from '../../../services/SalesOrderItemService'

const SalesOrderItems = (props) => {
    const {
        salesOrderId,
        setPageMetadata,
        currentPage,
        pageSize
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [salesItems, setSalesItems] = useState([]);

    useEffect(() => {
        const fetchSalesItems = async() => {
            try {
                const response = await salesItemHTTP.get(`/salesOrder/${salesOrderId}/salesItems`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setSalesItems(response.data.content);
                    const {content:_, ...rest} = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchSalesItems();
    }, [salesOrderId]);

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1,
            align: "center"
        },
        {
            title: "Sản phẩm",
            dataIndex: "productName",
            key: "productName",
            align: "center"
        },
        {
            title: "SL xuất",
            dataIndex: "quantitySold",
            key: "quantitySold",
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Đơn giá bán",
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value),
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Giảm giá",
            dataIndex: "discount",
            key: "discount",
            render: (value) => {value ? `${value}%` : "0%"},
            align: "right",
            titleAlign: "center"
        },
        {
            title: "VAT",
            dataIndex: "vatRate",
            key: "vatRate",
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            align: "center",
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
                        // onClick={() => handleClickEdit(record.id)} 
                    >
                        <span style={{fontSize: '1.4rem'}}>Sửa</span>
                    </Button>
                    <Button 
                        color="red" 
                        variant="solid"
                        // onClick={() => handleClickDelete(record.id)}  
                    >
                        <span style={{fontSize: '1.4rem'}}>Xóa</span>
                    </Button>
                  </Flex>
                )
            }
        }
    ]
    
    return (
        <Table
            columns={columns}
            dataSource={salesItems?.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default SalesOrderItems
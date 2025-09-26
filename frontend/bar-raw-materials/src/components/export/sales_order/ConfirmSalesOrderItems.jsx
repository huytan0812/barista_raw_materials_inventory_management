import React, {useState, useEffect, useRef} from 'react'
import {Table} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext';
import salesItemHTTP from '../../../services/SalesOrderItemService'

const ConfirmSalesOrderItems = (props) => {
    const {salesOrderId, currentPage, pageSize, setPageMetadata} = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [salesItems, setSalesItems] = useState([]);

    // side effect for fetching Sales Order Item and refreshing
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
    }, [salesOrderId, currentPage, pageSize]);

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
            render: (value) => {
                return `${value*100}%`
            },
            align: "right",
            titleAlign: "center"
        },
        {
            title: "VAT",
            dataIndex: "vatRate",
            key: "vatRate",
            render: (value) => {
                return `${value*100}%`
            },
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
            title: "Thanh toán",
            key: "payAmount",
            render: (_, record) => {
                const value = record.unitPrice * record.quantitySold * (1 - record.discount) * (1 + record.vatRate);
                return new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value);
            },
            align: "right",
            titleAlign: "center"
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={salesItems.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default ConfirmSalesOrderItems
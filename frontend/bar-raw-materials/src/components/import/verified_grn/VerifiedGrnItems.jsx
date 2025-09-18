import React, {useState, useEffect, useRef} from 'react'
import {Table} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext';
import grnItemHTTP from '../../../services/GoodsReceiptItemService'

const VerifiedGrnItems = (props) => {
    const {grnId, currentPage, pageSize, setPageMetadata} = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [grnItems, setGrnItems] = useState([]);

    useEffect(() => {
        const fetchGrnItems = async() => {
            try {
                const response = await grnItemHTTP.get(`grn/${grnId}/grnItems`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setGrnItems(response.data.content);
                    const {content:_, ...rest} = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchGrnItems();
    }, [grnId, currentPage, pageSize]);

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
        },
        {
            title: "SL nhập",
            dataIndex: "quantityImport",
            key: "quantityImport",
            align: "center"
        },
        {
            title: "Giá nhập",
            dataIndex: "unitCost",
            key: "unitCost",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value),
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Mã số lô",
            dataIndex: "lotNumber",
            key: "lotNumber",
        },
        {
            title: "Ngày sản xuất",
            dataIndex: "mfgDate",
            key: "mfgDate",
            render: (value) => {
                return new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }).format(new Date(value));
            },
            align: "right",
            titleAlign: "center"
        },
        {
            title: "HSD",
            dataIndex: "expDate",
            key: "expDate",
            render: (value) => {
                return new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }).format(new Date(value));
            },
            align: "right",
            titleAlign: "center"
        }
        ,{
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
            title: "Phải trả",
            key: "payAmount",
            render: (_, record) => {
                const value = record.unitCost * record.quantityImport * (1 + record.vatRate);
                return new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value);
            },
            align: "right",
            titleAlign: "center"
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={grnItems.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default VerifiedGrnItems
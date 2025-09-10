import React from 'react'
import {Table, Button} from 'antd'

const GrnItems = () => {
    const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1
        },
        {
            title: "Sản phẩm",
            dataIndex: "productName",
            key: "productName"
        },
        {
            title: "SL nhập",
            dataIndex: "quantityImport",
            key: "quantityImport",
        },
        {
            title: "Giá nhập",
            dataIndex: "importCost",
            key: "importCost"
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
                return new Intl.DateTimeFormat("vn-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }).format(new Date(value));
            }
        },
        {
            title: "HSD",
            dataIndex: "expDate",
            key: "expDate",
            render: (value) => {
                return new Intl.DateTimeFormat("vn-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }).format(new Date(value));
            }
        }
        ,{
            title: "VAT",
            dataIndex: "vatRate",
            key: "vatRate"
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
            // dataSource={grn.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default GrnItems
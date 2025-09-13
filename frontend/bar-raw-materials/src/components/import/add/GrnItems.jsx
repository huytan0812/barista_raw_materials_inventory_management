import React from 'react'
import {Table, Flex, Button} from 'antd'

const GrnItems = (props) => {
    const { grnItems } = props;

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1
        },
        {
            title: "Sản phẩm",
            key: "productName",
            render: (_, record) => {
                return record?.product?.name
            }
        },
        {
            title: "SL nhập",
            dataIndex: "quantityImport",
            key: "quantityImport",
        },
        {
            title: "Giá nhập",
            dataIndex: "unitCost",
            key: "unitCost",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value)
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
            }
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
            }
        }
        ,{
            title: "VAT",
            dataIndex: "vatRate",
            key: "vatRate",
            render: (value) => {
                return `${value*100}%`
            }
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
                        <span style={{fontSize: '1.4rem'}}>Sửa</span>
                    </Button>
                    <Button 
                        color="red" 
                        variant="solid" 
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
            dataSource={grnItems.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default GrnItems
import React, {useState, useEffect} from 'react'
import {Table} from 'antd'
import {useAuthContext} from '../../contexts/AuthContext'

const ImportPaperTable = () => {
    const {token} = useAuthContext();

    const columns = [
        {
            title: "STT",
            key: "stt",
        },
        {
            title: "Mã phiếu",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Nhà cung cấp",
            dataIndex: "vendorName",
            key: "vendorName",
        },
        {
            title: "Ngày tạo",
            dataIndex: "dateCreate",
            key: "dateCreate",
        },
        {
            title: "Người tạo",
            dataIndex: "createdBy",
            key: "createdBy",
        },
        {
            title: "Số hóa đơn",
            dataIndex: "invoiceNumber",
            key: "invoiceNumber",
        },
        {
            title: "Ngày tạo hóa đơn",
            dataIndex: "invoiceDate",
            key: "invoiceDate",
        }
        ,{
            title: "Trạng thái",
            dataIndex: "isConfirmed",
            key: "isConfirmed",
        },
        {
            title: "Hành động",
            key: "action",
            render: () => {
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
            // dataSource={data.map(product => ({...product, key: product.productId}))}
            pagination={false}
        />
    )
}

export default ImportPaperTable
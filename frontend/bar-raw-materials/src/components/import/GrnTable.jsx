import React, {useState, useEffect, useRef} from 'react'
import {Table, Flex, Button, Tag} from 'antd'
import { useNavigate } from 'react-router-dom'
import {useAuthContext} from '../../contexts/AuthContext'
import grnHTTP from '../../services/GoodsReceiptNoteService'

const GrnTable = ({
        currentPage,
        pageSize,
        setPageMetadata
    }) => {
    const [grn, setGrn] = useState([]);
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const navigate = useNavigate();

    const handleClickWatchDetails = (grnId, isConfirmed) => {
        if (isConfirmed) {
            navigate(`/import/grn/${grnId}`);
        }
        else {
            navigate(`/import/add_grn/${grnId}/add_grn_item`);
        }
    }

    useEffect(() => {
        const fetchGrn = async() => {
            try {
                const response = await grnHTTP.get('/list', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setGrn(response.data.content);
                    const { content: _, ...rest } = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchGrn();
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
            title: "Nhà cung cấp",
            dataIndex: "vendorName",
            key: "vendorName",
            align: "center"
        },
        {
            title: "Ngày tạo",
            dataIndex: "dateCreate",
            key: "dateCreate",
            render: (value) => {
                return new Intl.DateTimeFormat("vi-VN", {
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
            title: "Số hóa đơn",
            dataIndex: "invoiceNumber",
            key: "invoiceNumber",
            align: "center"
        },
        {
            title: "Ngày tạo hóa đơn",
            dataIndex: "invoiceDate",
            key: "invoiceDate",
            align: "right",
            titleAlign: "center"
        }
        ,{
            title: "Trạng thái",
            dataIndex: "isConfirmed",
            key: "isConfirmed",
            render: (_, record) => {
                if (record.isConfirmed) {
                    return (
                        <Tag color="green">Đã phê duyệt</Tag>
                    )
                }
                return <Tag color="red">Chưa phê duyệt</Tag>
            },
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
                        onClick={() => handleClickWatchDetails(record.id, record.isConfirmed)}
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
            dataSource={grn.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default GrnTable
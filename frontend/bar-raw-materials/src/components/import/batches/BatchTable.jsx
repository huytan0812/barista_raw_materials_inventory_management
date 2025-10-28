import React, {useState, useEffect, useRef} from 'react'
import {useAuthContext} from '../../../contexts/AuthContext'
import {Table, Flex, Button} from 'antd'
import batchHTTP from '../../../services/BatchService'

const BatchTable = (props) => {
    const {
        currentPage,
        pageSize,
        setPageMetadata
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchBatches = async() => {
            try {
                const response = await batchHTTP.get('/list', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setData(response.data.content);
                    const {content:_, ...metadata} = response.data;
                    setPageMetadata(metadata);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchBatches();
    }, [currentPage, pageSize]);

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1,
            align: "center"
        },
        {
            title: "Mã lô",
            dataIndex: "lotNumber",
            key: "lotNumber",
            align: "center"
        },
        {
            title: "Sản phẩm",
            dataIndex: "productName",
            key: "productName",
            align: "center"
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
            title: "Hạn sử dụng",
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
        },
        {
            title: "SLCL",
            dataIndex: "quantityRemain",
            key: "quantityRemain",
            titleAlign: "center",
            align: "right"
        },
        {
            title: "Giá trị",
            dataIndex: "currentValue",
            key: "currentValue",
            titleAlign: "center",
            align: "right",
            render: (value) => {
                return new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                }).format(value);
            },
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
            dataSource={data.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default BatchTable
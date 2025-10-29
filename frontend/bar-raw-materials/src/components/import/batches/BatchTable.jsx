import React, {useState, useEffect, useRef} from 'react'
import {useAuthContext} from '../../../contexts/AuthContext'
import {Table, Flex, Button, Tag} from 'antd'
import batchHTTP from '../../../services/BatchService'
import dayjs from 'dayjs'

const BatchTable = (props) => {
    const {
        currentPage,
        pageSize,
        setPageMetadata,
        searchText,
        sort,
        filter,
        setLoadingTable
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    const [data, setData] = useState([]);
    // side effect for handling initial data
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
                    setLoadingTable(false);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        if (!searchText && !sort && !filter) fetchBatches();
    }, [searchText, sort, filter, currentPage, pageSize]);

    // side effect for handling search
    useEffect(() => {
        const search = async() => {
            try {
                const response = await batchHTTP.get('/search', {
                    headers: {
                        Authorization : `Bearer ${persistToken.current}`
                    },
                    params: {
                        search: searchText ? searchText : '',
                        sort: sort ? sort : '',
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setData(response.data.content);
                    const {content:_, ...metadata} = response.data;
                    setPageMetadata(metadata);
                    setLoadingTable(false);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        if (searchText || sort) search();
    }, [searchText, sort, currentPage, pageSize]);

    // side effect for handling filter
    useEffect(() => {
        const filterBatches = async() => {
            try {
                const response = await batchHTTP.get('/filter', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        filter: filter ? filter : '',
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setData(response.data.content);
                    const {content:_, ...metadata} = response.data;
                    setPageMetadata(metadata);
                    setLoadingTable(false);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        if (filter) filterBatches();
    }, [filter, currentPage, pageSize]);

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
            title: "Trạng thái",
            key: "status",
            align: "center",
            render: (_, record) => {
                const expDate = dayjs(record.expDate);
                return (
                    <Tag 
                        color={
                                dayjs().isAfter(expDate) 
                                ? 
                                'red' 
                                :
                                dayjs().add(record.expiryWarningThreshold, 'day').isAfter(expDate)
                                ?
                                'orange'
                                :
                                'green'
                            }
                    >
                        {
                            dayjs().isAfter(expDate) 
                            ? 
                            "Hết HSD" 
                            :
                            dayjs().add(record.expiryWarningThreshold, 'day').isAfter(expDate)
                            ?
                            "Gần hết HSD"
                            :
                            "Còn HSD"
                        }
                    </Tag>
                );
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
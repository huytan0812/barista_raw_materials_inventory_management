import React, {useState, useEffect, useRef} from 'react'
import {Table} from 'antd'
import { useAuthContext } from '../../contexts/AuthContext';
import pdrHTTP from '../../services/ProductDailyReportService';


const ProductDailyReport = (props) => {
    const {
        reportId,
        currentPage,
        pageSize,
        setPageMetadata
    } = props;
    const { token } = useAuthContext();
    const persistToken = useRef(token);
    const [pdrs, setPdrs] = useState([]);

    // Fetch data from server
    useEffect(() => {
        const fetchPdrs = async() => {
            try {
                const response = await pdrHTTP.get(`dailyReport/${reportId}/list`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        pageSize: pageSize
                    }
                });
                if (response.status === 200) {
                    setPdrs(response.data.content);
                    const {content:_, ...rest} = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchPdrs();
    }, [reportId, currentPage, pageSize]);

    const columns = [
        {
        title: "STT",
        key: "stt",
        render: (_, __, index) => index + 1,
        align: "center",
        },
        {
            title: "Sản phẩm",
            dataIndex: 'productName',
            key: "productName",
            onCell: () => ({
                style: {
                maxWidth: '20rem',
                whiteSpace: "normal", 
                wordBreak: "break-word"
                },
            }),
            align: "left",
            titleAlign: "center"
        },
        {
            title: "SL nhập kho",
            dataIndex: "importQuantity",
            key: "importQuantity",
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Giá trị nhập kho",
            dataIndex: "importAmount",
            key: "importAmount",
            align: "right",
            titleAlign: "center",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value)
        },
        {
            title: "SL xuất kho",
            dataIndex: "exportQuantity",
            key: "exportQuantity",
            align: "right",
            titleAlign: "center",
        },
        {
            title: "GVHB",
            dataIndex: "cogs",
            key: "cogs",
            align: "right",
            titleAlign: "center",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value)
        },
        {
            title: "Doanh thu",
            dataIndex: "revenue",
            key: "revenue",
            align: "right",
            titleAlign: "center"
        },
        ];
    return (
        <Table
            columns={columns}
            dataSource={pdrs?.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default ProductDailyReport
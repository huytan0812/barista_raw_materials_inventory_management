import React, {useState, useEffect, useRef} from 'react'
import {Table, Button, Flex} from 'antd'
import { useAuthContext } from '../../contexts/AuthContext'
import productInvHTTP from '../../services/ProductInventory'

const VATTable = (props) => {
    const {
        currentPage,
        pageSize,
        setPageMetadata
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [productsVAT, setProductsVAT] = useState([]);

    useEffect(() => {
        const fetchProductsVAT = async() => {
            try {
                const response = await productInvHTTP.get('allProductVAT', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setProductsVAT(response.data.content);
                    const {content:_, ...rest} = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchProductsVAT();
    }, [currentPage, pageSize]);

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
            title: "VAT đầu vào",
            dataIndex: "inputVAT",
            key: "inputVAT",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value),
            align: "right",
            titleAlign: "center"
        },
        {
            title: "VAT đầu ra",
            dataIndex: "outputVAT",
            key: "outputVAT",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value),
            align: "right",
            titleAlign: "center"
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={productsVAT.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default VATTable
import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import {Table} from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import axiosHTTP from '../../services/ProductService'

const ProductTable = ({currentPage, pageSize, refresh, setPageMetadata}) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate

    const { token } = useAuthContext();
    const columns = [
        {
            title: "ID",
            dataIndex: "productId",
            key: "id"
        },
        {
            title: "SKU",
            dataIndex: "sku",
            key: "sku"
        },
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Danh mục",
            dataIndex: "categoryName",
            key: "categoryName"
        },
        {
            title: "Khối lượng tịnh / Thể tích thực",
            dataIndex: "packSize",
            key: "packSize"
        },
        {
            title: "Đơn vị tính",
            dataIndex: "unit",
            key: "unit"
        },
        {
            title: "Giá niêm yết",
            dataIndex: "listPrice",
            key: "listPrice",
            render: (price) =>  new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(price)
        }
    ]

    useEffect(
        () => {
            const fetchProducts = async () => {
                try {
                    const response = await axiosHTTP.get('/list',
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                            ,
                            params: {
                                'page': currentPage - 1, // adjust for zero-based index in spring boot
                                'size': pageSize
                            }
                        }
                    )
                    setData(response.data.content);
                    const {content, ...rest} = response.data;
                    setPageMetadata(rest);
                }
                catch (error) {
                    console.log(error);
                    navigate('/login');
                }
            }
            fetchProducts();
        }, [token, currentPage, pageSize, refresh, navigate]
    )

    return (
        <Table
            columns={columns}
            dataSource={data.map(product => ({...product, key: product.productId}))}
        />
    )
}

export default ProductTable
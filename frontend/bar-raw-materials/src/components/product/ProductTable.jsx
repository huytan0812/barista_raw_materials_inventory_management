import React, {useState, useEffect} from 'react'
import {Table} from 'antd';
import {useNavigate} from 'react-router-dom'
import axiosHTTP from '../../services/ProductService'

const ProductTable = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
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
            render: (price) => `${price} VND`
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
                        }
                    )
                    setData(response.data);
                }
                catch (error) {
                    console.log(error);
                    navigate('/login');
                }
            }
            fetchProducts();
        }, [token, navigate]
    )

    return (
        <Table
            columns={columns}
            dataSource={data.map(product => ({...product, key: product.productId}))}
        />
    )
}

export default ProductTable
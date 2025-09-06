import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import {Table, Image, Flex, Button} from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import EditProductModal from './EditProductModal';
import axiosHTTP from '../../services/ProductService'

const ProductTable = ({currentPage, pageSize, refresh, setPageMetadata}) => {
    const [data, setData] = useState([]);
    const navigate = useNavigate
    const { token } = useAuthContext();
    const [activeModal, setActiveModal] = useState(0);

    const handleUpdateClick = (productId) => {
        setActiveModal(parseInt(productId));
    }

    const resetActiveModal = () => {
        setActiveModal(0);
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "productId",
            key: "id",
        },
        {
            title: "SKU",
            dataIndex: "sku",
            key: "sku"
        },
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
            width: "20rem"
        },
        {
            title: "Hình ảnh",
            dataIndex: "imageName",
            key: "imageName",
            render: (imageName) => {
                return (
                    <Image 
                        src={`http://localhost:8080/api/image/product/${imageName}`}
                        width={150}
                        height={150}
                        preview={{
                            mask: <span>Xem ảnh</span>
                        }}
                        fallback="http://localhost:8080/api/image/default.png"
                    />
                )
            }
        },
        {
            title: "Danh mục",
            dataIndex: "categoryName",
            key: "categoryName"
        },
        {
            title: (
                <span style={{ fontSize: '1.4rem' }}>Khối lượng tịnh / <br/> Thể tích thực</span>
            ),
            dataIndex: "packSize",
            key: "packSize",
            render: (_, record) => {
                let subUnit = '';
                if (record.unit === 'kg') {
                    subUnit = 'g';
                }
                if (record.unit === 'L') {
                    subUnit = 'ml';
                }
                return `${record.packSize*1000}${subUnit}`
            }
        },
        {
            title: (<span style={{textAlign: 'center', fontSize: '1.4rem'}}>Giá niêm yết</span>),
            dataIndex: "listPrice",
            key: "listPrice",
            render: (price) =>  {
                return (
                    <p style={{textAlign: 'right', fontSize: '1.4rem'}}>
                        {new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(price)}
                    </p>
                )
            },
        },
        {
            title: "Hành động",
            key: "action",
            render: (record) => {
                return (
                  <Flex gap="1rem">
                    <Button 
                        color="blue" 
                        variant="solid" 
                        onClick={() => handleUpdateClick(record.productId)}
                        value={record.productId}
                    >
                        <span style={{fontSize: '1.4rem'}}>Sửa</span>
                    </Button>
                    <EditProductModal 
                        isActive={activeModal === record.productId}
                        productId={record.productId}
                        resetActiveModal={resetActiveModal}
                    />
                    <Button color="red" variant="solid">
                      <span value={record.productId} style={{fontSize: '1.4rem'}}>Xóa</span>
                    </Button>
                  </Flex>
                )
            },
            align: "center"
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
                    const {content:_, ...rest} = response.data;
                    setPageMetadata(rest);
                }
                catch (error) {
                    console.log(error);
                    navigate('/login');
                }
            }
            fetchProducts();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [token, currentPage, pageSize, refresh, navigate]
    )

    return (
        <Table
            columns={columns}
            dataSource={data.map(product => ({...product, key: product.productId}))}
            pagination={false}
        />
    )
}

export default ProductTable
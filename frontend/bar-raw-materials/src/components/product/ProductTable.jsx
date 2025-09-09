import React, {useState, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom';
import {Table, Image, Flex, Button, message} from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal'
import axiosHTTP from '../../services/ProductService'

const ProductTable = ({currentPage, pageSize, refresh, setPageMetadata}) => {
    // fetching data from server
    const [data, setData] = useState([]);
    const [refreshAfterAction, setRefreshAfterAction] = useState(false);
    const navigate = useNavigate
    const { token } = useAuthContext();

    // handling active modal corresponding to the onClick event trigger
    // from a edit button on a product record
    const [activeModal, setActiveModal] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

    // handling active delete modal
    const [activeDeleteModal, setActiveDeleteModal] = useState(0);

    const success = (msg) => {
        messageApi.open({
        type: 'success',
        content: msg,
        });
    };

    const handleUpdateSuccess = (msg) => {
        success(msg);
        setRefreshAfterAction(true);
    }

    const handleUpdateClick = (productId) => {
        setActiveModal(parseInt(productId));
        setRefreshAfterAction(false);
    }

    const handleDeleteSuccess = (msg) => {
        success(msg);
        setRefreshAfterAction(true);
    };

    const handleDeleteClick = (productId) => {
        setActiveDeleteModal(parseInt(productId));
        setRefreshAfterAction(false);
    }

    // reset edit product active modal
    const resetActiveModal = () => {
        setActiveModal(0);
    }

    // reset delete product active modal
    const resetDeleteActiveModal = () => {
        setActiveDeleteModal(0);
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
                        onUpdateSuccess={handleUpdateSuccess}
                    />
                    <Button 
                        color="red" 
                        variant="solid"
                        onClick={() => {handleDeleteClick(record.productId)}}
                    >
                      <span value={record.productId} style={{fontSize: '1.4rem'}}>Xóa</span>
                    </Button>
                    <DeleteProductModal
                        isActive={activeDeleteModal === record.productId}
                        resetActiveModal={resetDeleteActiveModal}
                        productId={record.productId}
                        productName={record.name}
                        onDeleteSuccess={handleDeleteSuccess}
                    />
                  </Flex>
                )
            },
            align: "center"
        }
    ]

    const fetchProducts = useCallback(async () => {
        try {
            const response = await axiosHTTP.get("/list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: currentPage - 1, // adjust for zero-based index in spring boot
                size: pageSize,
            },
            });

            setData(response.data.content);
            const { content: _, ...rest } = response.data;
            setPageMetadata(rest);
        } catch (error) {
            console.log(error);
            navigate("/login");
        }
    }, [token, currentPage, pageSize, navigate]);

    // side effect for fetching products
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // side effect for refreshing product table
    useEffect(() => {
        console.log("Refresh after action:", refreshAfterAction);
        if (refresh || refreshAfterAction) {
            console.log("On refreshing...");
            fetchProducts();
        }
    }, [refresh, refreshAfterAction, fetchProducts]);

    return (
        <React.Fragment>
            {contextHolder}
            <Table
                columns={columns}
                dataSource={data.map(product => ({...product, key: product.productId}))}
                pagination={false}
            />
        </React.Fragment>
    )
}

export default ProductTable
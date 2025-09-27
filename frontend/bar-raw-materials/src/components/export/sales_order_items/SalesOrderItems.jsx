import React, {useState, useEffect, useRef} from 'react'
import {Table, Flex, Button} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext'
import salesItemHTTP from '../../../services/SalesOrderItemService'
import EditSalesItemModal from './EditSalesItemModal'
import DeleteSalesItemModal from './DeleteSalesItemModal'

const SalesOrderItems = (props) => {
    const {
        popUpMsg,
        salesOrderId,
        setPageMetadata,
        currentPage,
        pageSize,
        refreshSaleItems,
        setRefreshSaleItems
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    // states for handling fetching Sales Order Items
    const [salesItems, setSalesItems] = useState([]);

    // states for handling trigger corresponding edit or delete GRN item
    const [activeEditModal, setActiveEditModal] = useState(0);
    const [activeDeleteModal, setActiveDeleteModal] = useState(0);

    const handleClickEdit = (salesItemId) => {
        setActiveEditModal(parseInt(salesItemId));
    }
    const handleClickDelete = (salesItemId) => {
        setActiveDeleteModal(parseInt(salesItemId));
    }
    const resetActiveEditModal = () => {
        setActiveEditModal(0);
    }
    const resetActiveDeleteModal = () => {
        setActiveDeleteModal(0);
    }

    // side effect for fetching Sales Order Item and refreshing
    useEffect(() => {
        const fetchSalesItems = async() => {
            try {
                const response = await salesItemHTTP.get(`/salesOrder/${salesOrderId}/salesItems`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setSalesItems(response.data.content);
                    const {content:_, ...rest} = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchSalesItems();
    }, [salesOrderId, currentPage, pageSize, refreshSaleItems]);
    const handleEditSuccess = (msg) => {
        popUpMsg('success', msg);
        resetActiveEditModal();
        setRefreshSaleItems(prev=>!prev);
    }
    const handleDeleteSuccess = (msg) => {
        popUpMsg('success', msg);
        resetActiveDeleteModal();
        setRefreshSaleItems(prev=>!prev);
    }

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
            align: "left",
            titleAlign: "center"
        },
        {
            title: "SL xuất",
            dataIndex: "quantitySold",
            key: "quantitySold",
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Đơn giá bán",
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value),
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Giảm giá",
            dataIndex: "discount",
            key: "discount",
            render: (value) => {
                return `${value*100}%`
            },
            align: "right",
            titleAlign: "center"
        },
        {
            title: "VAT",
            dataIndex: "vatRate",
            key: "vatRate",
            render: (value) => {
                return `${value*100}%`
            },
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            align: "center",
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
                        onClick={() => handleClickEdit(record.id)} 
                    >
                        <span style={{fontSize: '1.4rem'}}>Sửa</span>
                    </Button>
                    <EditSalesItemModal
                        isActive={activeEditModal === record.id}
                        salesItem={record}
                        popUpMsg={popUpMsg}
                        onEditSuccess={handleEditSuccess}
                        resetActiveEditModal={resetActiveEditModal}
                    />
                    <Button 
                        color="red" 
                        variant="solid"
                        onClick={() => handleClickDelete(record.id)}  
                    >
                        <span style={{fontSize: '1.4rem'}}>Xóa</span>
                    </Button>
                    <DeleteSalesItemModal
                        isActive={activeDeleteModal === record.id}
                        resetActiveDeleteModal={resetActiveDeleteModal}
                        popUpMsg={popUpMsg}
                        onDeleteSuccess={handleDeleteSuccess}
                        salesItemId={record.id}
                        productName={record.productName}
                    />
                  </Flex>
                )
            }
        }
    ]
    
    return (
        <Table
            columns={columns}
            dataSource={salesItems?.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default SalesOrderItems
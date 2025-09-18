import React, {useState} from 'react'
import {Table, Flex, Button} from 'antd'
import EditGrnItemModal from './EditGrnItemModal';
import DeleteGrnItemModal from './DeleteGrnItemModal';

const GrnItems = (props) => {
    const { grnItems, setRefreshGrnItems, successMsg, failMsg } = props;
    // states for handling trigger corresponding edit or delete GRN item
    const [activeEditModal, setActiveEditModal] = useState(0);
    const [activeDeleteModal, setActiveDeleteModal] = useState(0);

    const handleClickEdit = (grnItemId) => {
        setActiveEditModal(parseInt(grnItemId));
    }
    const handleClickDelete = (grnItemId) => {
        setActiveDeleteModal(parseInt(grnItemId));
    }

    const resetActiveEditModal = () => {
        setActiveEditModal(0);
    }
    const resetActiveDeleteModal = () => {
        setActiveDeleteModal(0);
    }

    const handleEditSuccess = (msg) => {
        successMsg(msg);
        resetActiveEditModal();
        setRefreshGrnItems(prev=>!prev);
    }

    const handleDeleteSuccess = (msg) => {
        successMsg(msg);
        resetActiveDeleteModal();
        setRefreshGrnItems(prev=>!prev);
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
        },
        {
            title: "SL nhập",
            dataIndex: "quantityImport",
            key: "quantityImport",
            align: "center"
        },
        {
            title: "Giá nhập",
            dataIndex: "unitCost",
            key: "unitCost",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value),
            align: "right",
            titleAlign: "center"
        },
        {
            title: "Mã số lô",
            dataIndex: "lotNumber",
            key: "lotNumber",
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
            title: "HSD",
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
        }
        ,{
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
                    <EditGrnItemModal 
                        isActive={activeEditModal === record.id}
                        resetActiveEditModal={resetActiveEditModal}
                        onEditSuccess={handleEditSuccess}
                        grnItem={record}
                        failMsg={failMsg}
                    />
                    <Button 
                        color="red" 
                        variant="solid"
                        onClick={() => handleClickDelete(record.id)}  
                    >
                        <span style={{fontSize: '1.4rem'}}>Xóa</span>
                    </Button>
                    <DeleteGrnItemModal
                        isActive={activeDeleteModal === record.id}
                        resetActiveDeleteModal={resetActiveDeleteModal}
                        failMsg={failMsg}
                        onDeleteSuccess={handleDeleteSuccess}
                        grnItemId={record.id}
                        lotNumber={record.lotNumber}
                    />
                  </Flex>
                )
            }
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={grnItems.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default GrnItems
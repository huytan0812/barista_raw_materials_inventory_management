import React, {useState} from 'react'
import {Table, Flex, Button, message} from 'antd'
import EditGrnItemModal from '../add_grn_items/EditGrnItemModal';

const GrnItems = (props) => {
    const { grnItems } = props;
    // states for handling trigger corresponding edit or delete GRN item
    const [activeEditModal, setActiveEditModal] = useState(0);
    const [activeDeleteModal, setActiveDeleteModal] = useState(0);
    // states for handling message
    const [messageAPI, contextHolder] = message.useMessage();

    const successMsg = (msg) => {
        messageAPI.open({
            type: 'success',
            content: msg
        })
    };

    const handleClickEdit = (grnItemId, grnItem) => {
        console.log("edit grnItemId:", grnItemId);
        console.log(grnItem);
        setActiveEditModal(parseInt(grnItemId));
    }
    const handleClickDelete = (grnItemId, grnItem) => {
        console.log("delete grnItemId:", grnItemId);
        console.log(grnItem);
        setActiveDeleteModal(parseInt(grnItemId));
    }

    const resetActiveEditModal = () => {
        setActiveEditModal(0);
    }
    const resetActiveDeleteModal = () => {
        setActiveDeleteModal(0);
    }

    const handleEditSuccess = (msg) => {
        successMsg();
    }

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1
        },
        {
            title: "Sản phẩm",
            key: "productName",
            render: (_, record) => {
                return record?.product?.name
            }
        },
        {
            title: "SL nhập",
            dataIndex: "quantityImport",
            key: "quantityImport",
        },
        {
            title: "Giá nhập",
            dataIndex: "unitCost",
            key: "unitCost",
            render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value)
        },
        {
            title: "Mã số lô",
            dataIndex: "lotNumber",
            key: "lotNumber",
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
            }
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
            }
        }
        ,{
            title: "VAT",
            dataIndex: "vatRate",
            key: "vatRate",
            render: (value) => {
                return `${value*100}%`
            }
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
                        onClick={() => handleClickEdit(record.id, record)} 
                    >
                        <span style={{fontSize: '1.4rem'}}>Sửa</span>
                    </Button>
                    <EditGrnItemModal 
                        isActive={activeEditModal === record.id}
                        resetActiveEditModal={resetActiveEditModal}
                        onEditSuccess={handleEditSuccess}
                        grnItem={record}
                    />
                    <Button 
                        color="red" 
                        variant="solid"
                        onClick={() => handleClickDelete(record.id, record)}  
                    >
                        <span style={{fontSize: '1.4rem'}}>Xóa</span>
                    </Button>
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
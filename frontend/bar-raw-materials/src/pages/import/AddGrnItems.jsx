import React, {useState, useEffect, useRef} from 'react'
import { useParams, NavLink } from 'react-router-dom'
import {Card, Flex, Button, Space, Breadcrumb, message, Modal, Form} from 'antd'
import GrnDetails from '../../components/import/add/GrnDetails'
import GrnItems from '../../components/import/add/GrnItems'
import AddGrnItemForm from '../../components/import/add_grn_items/AddGrnItemForm'
import { useAuthContext } from '../../contexts/AuthContext'
import grnHTTP from '../../services/GoodsReceiptNoteService'

const AddGrnItems = () => {
    const { token } = useAuthContext();
    const persistToken = useRef(token);
    const params = useParams();
    const grnId = params.grnId;
    const [addGrnItemForm] = Form.useForm();

    const [grn, setGrn] = useState([]);
    const [refreshGrn, setRefreshGrn] = useState(false);
    const [refreshGrnItems, setRefreshGrnItems] = useState(false);

    // states for handling add new GRN item
    const [open, setOpen] = useState(false);
    
    const [messageAPI, contextHolder] = message.useMessage();

    const successMsg = (msg) => {
        messageAPI.open({
            type: 'success',
            content: msg
        });
    };

    // handling edit GRN info success
    const handleEditSuccess = (msg) => {
        successMsg(msg);
        setRefreshGrn(prev=>!prev);
    };
     
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        addGrnItemForm.submit();
    };
    const handleCancel = () => {
        addGrnItemForm.resetFields();
        setOpen(false);
    };

    // pass this event handler to AddGrnItemForm
    // AddGrnItemForm pass this event handler to BaseGrnItemForm as Form onFinish event handler
    const handleSubmitAddGrnItem = () => {

    }

    const handleAddGrnItemSuccess = (msg) => {
        successMsg(msg);
        setOpen(false);
        setRefreshGrnItems(prev => !prev);
    };

    useEffect(() => {
        const fetchGrn = async() => {
            try {
                const response = await grnHTTP.get(`details/${grnId}`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                setGrn(response.data);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchGrn();
    }, [grnId, refreshGrn]);

    return (
        <React.Fragment>
            {contextHolder}
            <div>
                <Breadcrumb 
                    items={
                        [ {
                            title:  (<NavLink to="/import">
                                    <span>Nhập kho</span>
                                    </NavLink>)
                        },
                        {
                            title: (<NavLink to="/import/add_grn">
                                    <span>Tạo phiếu nhập</span>
                                    </NavLink>)
                        },
                        {
                            title: `Thêm sản phẩm vào phiếu nhập`
                        }
                        ]
                    }
                />
            </div>
            <Card 
                title={<h3 
                        style={{
                            textAlign: 'center',
                            fontSize: '2rem'
                        }}
                    >
                    Phiếu nhập kho
                    </h3>
                }
                style={{
                    width: '966px',
                    margin: '0.8rem auto'
                }}
                styles={{
                    body: {
                        padding: '12px 12px'
                    }
                }}
            >
                <GrnDetails
                    grnId={grnId}
                    grn={grn}
                    onEditSuccess={handleEditSuccess}
                />
                <Card
                    style={{
                        marginTop: '0.8rem'
                    }}
                    title={
                    <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span style={{ fontWeight: "bold" }}>Danh sách các lô sản phẩm nhập</span>
                        <Space>
                            <Button 
                                type="primary"
                                onClick={showModal}
                            >
                                Thêm lô hàng
                            </Button>
                            <Modal
                                open={open}
                                destroyOnHidden={true}
                                title="Thêm lô hàng"
                                onOk={handleOk}
                                onCancel={handleCancel}
                                footer={[
                                    <Button key="back" onClick={handleCancel}>
                                        Hủy
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={handleOk}>
                                        Xác nhận
                                    </Button>
                                ]}
                                >
                                    <AddGrnItemForm 
                                        form={addGrnItemForm}
                                        handleSubmit={handleSubmitAddGrnItem}
                                        grnId={grnId} 
                                    />
                            </Modal>
                        </Space>
                    </Space>
                }
                variant='bordered'
                >
                    <GrnItems />
                </Card>
            </Card>
        </React.Fragment>
    )
}

export default AddGrnItems
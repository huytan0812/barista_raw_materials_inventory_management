import React, {useState, useEffect, useRef} from 'react'
import { useParams, NavLink } from 'react-router-dom'
import {Card, Row, Col, Button, Space, Breadcrumb, message, Modal, Form, Pagination} from 'antd'
import GrnDetails from '../../components/import/add/GrnDetails'
import GrnItems from '../../components/import/add/GrnItems'
import AddGrnItemForm from '../../components/import/add_grn_items/AddGrnItemForm'
import { useAuthContext } from '../../contexts/AuthContext'
import grnHTTP from '../../services/GoodsReceiptNoteService'
import grnItemHTTP from '../../services/GoodsReceiptItemService'
import userHTTP from '../../services/UserService'

const AddGrnItems = () => {
    const { token } = useAuthContext();
    const persistToken = useRef(token);
    const params = useParams();
    const grnId = params.grnId;
    const [addGrnItemForm] = Form.useForm();

    // states for handling fetching GRN
    const [grn, setGrn] = useState({});
    const [refreshGrn, setRefreshGrn] = useState(false);

    // states for fetching GRN items
    const [grnItem, setGrnItem] = useState([]);
    const [refreshGrnItems, setRefreshGrnItems] = useState(false);
    // GRN items pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const PAGE_SIZE = 5;

    // states for handling add new GRN item
    const [open, setOpen] = useState(false);
    
    // state for handling message popup
    const [messageAPI, contextHolder] = message.useMessage();

    // state for getting current login user role
    const [role, setRole] = useState(null);

    const successMsg = (msg) => {
        messageAPI.open({
            type: 'success',
            content: msg
        });
    };

    const failMsg = (msg) => {
    messageAPI.open({
      type: 'error',
      content: msg,
      duration: 1.5
    })
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
    const handleSubmitAddGrnItem = (values) => {
        const submit = async() => {
            try {
                const formData = new FormData();
                const {...rest} = values;
                console.log(values);
                const data = rest;
                // format date to ISO
                if (data.mfgDate) data.mfgDate = data.mfgDate.format("YYYY-MM-DD");
                if (data.expDate) data.expDate = data.expDate.format("YYYY-MM-DD");
                
                // convert vat rate to percentage
                if (data.vatRate) data.vatRate /= 100;
                formData.append('data', new Blob([JSON.stringify(data)], {type: 'application/json'}));

                const response = await grnItemHTTP.post('/add', formData, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200) {
                    addGrnItemForm.resetFields();
                    handleAddGrnItemSuccess(`Lô hàng nhập kho ${data.lotNumber} đã được tạo thành công`);
                }
                else {
                    console.log(response);
                }
            }
            catch (error) {
                const responseErr = error.response;
                if (responseErr.data?.failToCreate) {
                    failMsg(responseErr.failToCreate);
                }
                if (responseErr.data?.expDateErr) {
                    addGrnItemForm.setFields([
                        {
                            name: 'expDate',
                            errors: [responseErr.data.expDateErr]
                        }
                    ]);
                }
            }
        }
        submit();
    }

    const handleAddGrnItemSuccess = (msg) => {
        successMsg(msg);
        setOpen(false);
        setRefreshGrnItems(prev => !prev);
    };

    // side effect for fetching GoodsReceiptNote
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

    // side effect for fetching GRN items
    useEffect(() => {
        const fetchGrnItems = async() => {
            try {
                const response = await grnItemHTTP.get(`grn/${grnId}/grnItems`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: PAGE_SIZE
                    }
                });
                if (response.status === 200) {
                    setGrnItem(response.data.content);
                    const {content:_, ...rest} = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchGrnItems();
    }, [refreshGrnItems, grnId, currentPage]);

    // side effect for getting role
    useEffect(() => {
        const fetchRole = async() => {
            try {
                const response = await userHTTP.get('/role', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                console.log(response);
                if (response.status === 200) {
                    setRole(response.data.role);
                }
            }
            catch (error) {
                console.log(error);
            }
        };  
        fetchRole();
    }, [])

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
                                    </Button>
                                    ,
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
                    <GrnItems
                        grnItems={grnItem}
                        setRefreshGrnItems={setRefreshGrnItems}
                        successMsg={successMsg}
                        failMsg={failMsg}
                    />
                    <div style={{ textAlign: "right", marginTop: 16 }}>
                    <Pagination
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={pageMetadata.page?.totalElements || 0}
                        onChange={(page) => setCurrentPage(page)}
                        showTotal={(total) => `Hiện đang có ${total} lô hàng`}
                    />
                    </div>
                </Card>
                {/* Footer */}
                <Row 
                    justify="end" 
                    gutter={8}
                    style={{
                        marginTop: '0.8rem',
                        paddingRight: '2rem'
                    }}
                >
                    <Col>
                        <Button
                            color="red"
                            variant="solid"
                        >
                            Hủy phiếu
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary">Hoàn tất</Button>
                    </Col>
                    {
                        role==="admin" &&
                        <Col>
                            <Button color="green" variant="solid">Duyệt phiếu</Button>
                        </Col>
                    }
                </Row>
            </Card>
        </React.Fragment>
    )
}

export default AddGrnItems
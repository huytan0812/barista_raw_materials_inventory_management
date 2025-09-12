import React, {useState, useEffect, useRef} from 'react'
import { useParams, NavLink } from 'react-router-dom'
import {Card, Flex, Button, Space, Breadcrumb, message} from 'antd'
import GrnDetails from '../../components/import/add/GrnDetails'
import GrnItems from '../../components/import/add/GrnItems'
import { useAuthContext } from '../../contexts/AuthContext'
import grnHTTP from '../../services/GoodsReceiptNoteService'

const AddGrnItems = () => {
    const { token } = useAuthContext();
    const persistToken = useRef(token);
    const params = useParams();
    const grnId = params.grnId;

    const [grn, setGrn] = useState([]);
    const [refreshGrn, setRefreshGrn] = useState(false);

    const [messageAPI, contextHolder] = message.useMessage();

    const handleEditSuccess = (msg) => {
        messageAPI.open({
            type: 'success',
            content: msg
        });
        setRefreshGrn(prev=>!prev);
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
                            >
                            Thêm sản phẩm
                            </Button>
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
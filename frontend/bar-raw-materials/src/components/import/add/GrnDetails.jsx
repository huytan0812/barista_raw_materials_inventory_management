import React, {useState, useEffect, useRef} from 'react'
import {Flex, Space, Row, Col, Image, Button} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext'
import grnHTTP from '../../../services/GoodsReceiptNoteService'

const GrnDetails = ({params}) => {
    const [grn, setGrn] = useState({});
    const grnId = params.grnId;
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    useEffect(() => {
        const fetchGrn = async () => {
            try {
                const response = await grnHTTP.get(`/details/${grnId}`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                console.log(response);
                console.log(response.data.vendor.name);
                setGrn(response.data);
            }
            catch (e) {
                console.log(e);
            }
        }
        fetchGrn();
    }, [grnId]);

    return (
        <Row
            align="middle"
            gutter="16"
            style={{
                justifyContent: 'center'
            }}
        >
            <Col
                span={16}
            >
                <p>
                    <Space
                        wrap="wrap"
                        gap="16"
                    >
                        <p>
                            <strong style={{fontSize: '1.4rem'}}>Mã số phiếu: </strong>
                            <span style={{fontSize: '1.4rem'}}>{params.grnId}</span>
                        </p>
                        <p>
                            <strong style={{fontSize: '1.4rem'}}>Nhà cung cấp: </strong>
                            <span style={{fontSize: '1.4rem'}}>{grn?.vendor?.name}</span>
                        </p>
                    </Space>
                </p>
                <p>
                    <Space
                        wrap="wrap"
                        gap="16"
                    >
                        <p>
                            <strong style={{fontSize: '1.4rem'}}>Người nhận: </strong>
                            <span style={{fontSize: '1.4rem'}}>{grn?.receivedBy}</span>
                        </p>
                        <p>
                            <strong style={{fontSize: '1.4rem'}}>Người tạo phiếu: </strong>
                            <span style={{fontSize: '1.4rem'}}>{grn?.createdBy?.username}</span>
                        </p>
                    </Space>
                </p>
                <p>
                    <Space
                        wrap="wrap"
                        gap="16"
                    >
                        <p>
                            <strong style={{fontSize: '1.4rem'}}>Số hóa đơn: </strong>
                            <span style={{fontSize: '1.4rem'}}>{grn.invoiceNumber}</span>
                        </p>
                        <p>
                            <strong style={{fontSize: '1.4rem'}}>Ngày tạo hóa đơn: </strong>
                            <span style={{fontSize: '1.4rem'}}>{grn.invoiceDate}</span>
                        </p>
                    </Space>
                </p>
            </Col>
            <Col>
                <Image
                    width="15rem"
                    src={`http://localhost:8080/api/image/vendor/${grn?.invoiceImage}`}
                />
                <p
                    style={{
                        textAlign: 'center',
                        fontSize: '1.2rem'
                    }}
                >
                    Hình ảnh hóa đơn
                </p>
            </Col>
            <Col>
                <Button
                    type="primary"
                >
                    Sửa
                </Button>
            </Col>
        </Row>
  )
}

export default GrnDetails
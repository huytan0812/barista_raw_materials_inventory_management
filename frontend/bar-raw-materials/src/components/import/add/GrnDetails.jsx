import React, {useState, useEffect, useRef} from 'react'
import {Row, Col, Descriptions, Card, Image, Button} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext'
import grnHTTP from '../../../services/GoodsReceiptNoteService'

const dateOptions = {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                };

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
        <Card
            className="mb-6 shadow-md rounded-2xl"
            title={
                <span style={{ fontWeight: "bold" }}>Thông tin phiếu</span>
            }
            extra={
            <Button type="primary">
                Sửa phiếu
            </Button>
            }
      >
        <Row gutter={24} align="middle">
            <Col span={18}>
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="Mã phiếu nhập">{grn?.id}</Descriptions.Item>
                    <Descriptions.Item label="Người tạo">{grn?.createdBy?.username}</Descriptions.Item>
                    <Descriptions.Item label="Nhà cung cấp">{grn?.vendor?.name}</Descriptions.Item>
                    <Descriptions.Item label="Số hóa đơn">{grn?.invoiceNumber}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo hóa đơn">
                        {grn.invoiceDate && new Intl.DateTimeFormat("vi-VN", dateOptions)
                        .format(new Date(grn.invoiceDate))}
                    </Descriptions.Item>
                    <Descriptions.Item label="Người nhận">{grn?.receivedBy}</Descriptions.Item>
                    <Descriptions.Item label="Ngày nhận">
                        {
                            grn.dateReceived && new Intl.DateTimeFormat("vi-VN", dateOptions)
                            .formatRange(new Date(grn.dateReceived))
                        }
                    </Descriptions.Item>
                </Descriptions>
            </Col>
            <Col span={6}>
                <h3 
                    style={{
                        textAlign: 'center',
                        fontSize: '1.4rem'
                    }}
                >
                    Ảnh hóa đơn
                </h3>
                <Image
                    style={{ 
                            width: "75%",
                            height: "auto",
                            borderRadius: "8px",
                        }}
                    align="center"
                    src={`http://localhost:8080/api/image/vendor/${grn?.invoiceImage}`}
                    alt="Invoice"
                />
            </Col>
        </Row>
      </Card>
  )
}

export default GrnDetails
import React, {useState, useEffect, useRef} from 'react'
import {Row, Col, Descriptions, Card, Image} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext'
import grnHTTP from '../../../services/GoodsReceiptNoteService'

const dateOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
};

const VerifiedGrnDetails = (props) => {
    const {grnId} = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [grn, setGrn] = useState({});

    // side effect for fetching GRN
    useEffect(() => {
        const fetchGrn = async() => {
            try {
                const response = await grnHTTP.get(`details/${grnId}`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) setGrn(response.data);
            }
            catch (error) {
                console.log(error);
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
                            .format(new Date(grn.dateReceived))
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng phải trả cho NCC">
                        {new Intl.NumberFormat('vn-VN', {style: 'currency', currency: 'VND'}).format(grn?.totalAmount)}
                    </Descriptions.Item>
                </Descriptions>
            </Col>
            <Col span={6}>
                {
                    grn?.invoiceImage ?
                    (
                        <React.Fragment>
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
                        </React.Fragment>
                    )
                    :
                    <h3 
                        style={{
                            textAlign: 'center',
                            fontSize: '1.4rem'
                        }}
                    >
                        Chưa có ảnh
                    </h3>
                }
            </Col>
        </Row>
      </Card>
    )
}

export default VerifiedGrnDetails
import React, {useState, useEffect, useRef} from 'react'
import {Row, Col, Descriptions, Card, Image, Button, Modal, Form} from 'antd'
import { useAuthContext } from '../../../contexts/AuthContext'
import BaseGrnForm from './BaseGrnForm'
import vendorHTTP from '../../../services/VendorService'
import grnHTTP from '../../../services/GoodsReceiptNoteService'

const dateOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
};

const normFile = e => {
    if (Array.isArray(e)) {
    return e;
    }
    return e?.fileList;
};

const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const GrnDetails = (props) => {
    const {grnId, grn} = props;
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vendor, setVendor] = useState({});
    const [form] = Form.useForm();
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    }

    const handleEditGrnModal = () => {
        setOpen(true);
    }

    // side effect for fetching vendor
    useEffect(() => {
        const fetchVendor = async() => {
            try {
                const response = await vendorHTTP.get('/all', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                setVendor(response.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchVendor();
    }, []);

    return (
        <Card
            className="mb-6 shadow-md rounded-2xl"
            title={
                <span style={{ fontWeight: "bold" }}>Thông tin phiếu</span>
            }
            extra={
                <React.Fragment>
                    <Button 
                        type="primary"
                        onClick={handleEditGrnModal}
                    >
                        Sửa phiếu
                    </Button>
                    <Modal
                        title="Sửa phiếu"
                        open={open}
                        style={{
                            fontSize: '1.4rem',
                        }}
                        width="800px"
                        onOk={handleOk}
                        onCancel={handleCancel}
                        destroyOnHidden={true}
                        footer={
                        <>
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button loading={loading} type="primary" onClick={handleOk}>
                                Xác nhận
                            </Button>
                        </>
                        }
                    >
                        <BaseGrnForm 
                            form={form}
                            handleSubmit={handleOk}
                            vendor={vendor}
                            onChange={onChange}
                            normFile={normFile}
                            mode="update"
                            grn={grn}
                        />
                    </Modal>
                </React.Fragment>
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
                    src={grn?.invoiceImage && `http://localhost:8080/api/image/vendor/${grn?.invoiceImage}`}
                    alt="Invoice"
                />
            </Col>
        </Row>
      </Card>
  )
}

export default GrnDetails
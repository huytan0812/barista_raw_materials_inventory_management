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
    const {grnId, grn, onEditSuccess} = props;
    // states for rendering vendors in form
    const [vendor, setVendor] = useState({});
    // states for handling modal
    const [open, setOpen] = useState(false);

    const [form] = Form.useForm();
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    const handleOk = () => {
        // use form.submit() from AntD Form to trigger onFinish event handler
        form.submit();
    };

    const handleSubmit = (values) => {
        console.log(values);
        const submit = async() => {
            const formData = new FormData();
            const {image, ...rest} = values;
            const imageFile = image;
            const data = rest;
            // format date
            if (data.dateReceived) data.dateReceived = data.dateReceived.format("YYYY-MM-DD");
            if (data.invoiceDate) data.invoiceDate = data.invoiceDate.format("YYYY-MM-DD");

            if (imageFile?.[0]?.originFileObj) {
                formData.append('image', imageFile[0].originFileObj);
            }
            if (imageFile != null && imageFile.length != 0) {
                data.invoiceImage = imageFile[0].name;
            }
            formData.append('data', new Blob([JSON.stringify(data)], {type: 'application/json'}));
            try {
                const response = await grnHTTP.post(`update/${grnId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`,
                        'Content-Type': "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    setOpen(false);
                    onEditSuccess(`Phiếu nhập kho ${grnId} cập nhật thành công`);
                }
            }
            catch (error) {
                const responseData = error.response?.data?.duplicateInvoiceNumber;
                form.setFields([
                    {
                        name: 'invoiceNumber',
                        errors: [responseData]
                    }
                ]);
            }
        }
        submit();
    }

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
                            <Button type="primary" onClick={handleOk}>
                                Xác nhận
                            </Button>
                        </>
                        }
                    >
                        <BaseGrnForm 
                            form={form}
                            handleSubmit={handleSubmit}
                            vendor={vendor}
                            onDateChange={onChange}
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

export default GrnDetails
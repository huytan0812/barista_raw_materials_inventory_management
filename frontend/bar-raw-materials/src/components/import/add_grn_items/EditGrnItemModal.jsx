import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'antd'
import EditGrnItemForm from './EditGrnItemForm'
import { useAuthContext } from '../../../contexts/AuthContext'
import grnItemHTTP from '../../../services/GoodsReceiptItemService'

const EditGrnItemModal = (props) => {
    const {isActive, grnItem,  resetActiveEditModal, onEditSuccess, failMsg} = props;
    const {token} = useAuthContext();
    // states for handling open and close modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // states for handling form
    const [editGrnItemForm] = Form.useForm();

    const handleOk = () => {
        editGrnItemForm.submit();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        })
    }
    const handleCancel = () => {
        setOpen(false);
        resetActiveEditModal();
    }

    // submitting to server
    const handleSubmit = (values) => {
        console.log(values);
        const submit = async() => {
            try {
                const formData = new FormData();
                const {...rest} = values;
                const data = rest;
                // format date to ISO
                if (data.mfgDate) data.mfgDate = data.mfgDate.format("YYYY-MM-DD");
                if (data.expDate) data.expDate = data.expDate.format("YYYY-MM-DD");
                
                // convert vat rate to percentage
                if (data.vatRate) data.vatRate /= 100;
                formData.append('data', new Blob([JSON.stringify(data)], {type: 'application/json'}));

                const response = await grnItemHTTP.post(`/update/${grnItem.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200) {
                    editGrnItemForm.resetFields();
                    handleSubmitSuccess("Lô hàng nhập kho đã được cập nhật thành công");
                }
            }
            catch (error) {
                handleSubmitFail(error);
            }
        }
        submit();
    }

    const handleSubmitSuccess = (msg) => {
        onEditSuccess(msg);
        // close modal
        setOpen(false);
    }

    const handleSubmitFail = (error) => {
        const responseErr = error.response;
        if (responseErr.data?.failToCreate) {
            failMsg(responseErr.failToCreate);
        }
        if (responseErr.data?.expDateErr) {
            editGrnItemForm.setFields([
                {
                    name: 'expDate',
                    errors: [responseErr.data.expDateErr]
                }
            ]);
        }
    }

    // side effect for open modal
    useEffect(() => {
        if (isActive) setOpen(true);
    }, [isActive]);

    return (
        <Modal
            title="Sửa"
            open={open}
            style={{
                fontSize: '1.4rem',
            }}
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
            <EditGrnItemForm
                form={editGrnItemForm}
                grnItem={grnItem}
                handleSubmit={handleSubmit}
            />
        </Modal>
    )
}

export default EditGrnItemModal
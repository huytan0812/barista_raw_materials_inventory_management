import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'antd'
import EditSalesItemForm from './EditSalesItemForm'

const EditSalesItemModal = (props) => {
    const {
        isActive,
        salesItem, 
        resetActiveEditModal, 
        onEditSuccess, 
        popUpMsg
    } = props;
    // states for handling open and close modal
    const [open, setOpen] = useState(false);
    // states for handling form
    const [editSalesItemForm] = Form.useForm();

    const handleOk = () => {
        editSalesItemForm.submit();
    }
    const handleCancel = () => {
        setOpen(false);
        resetActiveEditModal();
    }
    const handleSubmitSuccess = (msg) => {
        onEditSuccess(msg);
        // close modal
        setOpen(false);
    }
    const handleSubmitFail = (error) => {
        const responseErr = error.response;
        popUpMsg(responseErr.failToCreate);
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
                <Button type="primary" onClick={handleOk}>
                    Xác nhận
                </Button>
            </>
            }
            width={768}
        >
            <EditSalesItemForm
                form={editSalesItemForm}
                salesItem={salesItem}
                handleSubmitSuccess={handleSubmitSuccess}
                handleSubmitFail={handleSubmitFail}
            />
        </Modal>
    )
}

export default EditSalesItemModal

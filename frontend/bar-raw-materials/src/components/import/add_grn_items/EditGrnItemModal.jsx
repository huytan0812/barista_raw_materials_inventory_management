import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'antd'
import EditGrnItemForm from './EditGrnItemForm'

const EditGrnItemModal = (props) => {
    const {isActive, grnItem,  resetActiveEditModal, onEditSuccess} = props;
    // states for handling open and close modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // states for handling form
    const [editGrnItemForm] = Form.useForm();

    console.log("Active:", isActive);

    const handleOk = () => {
        editGrnItemForm.submit();
        // setLoading(true);

        // setTimeout(() => {
        //     setLoading(false);
        // })
    }
    const handleCancel = () => {
        setOpen(false);
        resetActiveEditModal();
    }

    const handleSubmit = (values) => {
        console.log("submitting");
        console.log(values);
    }

    const handleSubmitSuccess = (msg) => {
        onEditSuccess(msg);
        setOpen(false);
        resetActiveEditModal();
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
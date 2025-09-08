import React, {useState, useEffect} from 'react'
import { Modal, Button } from 'antd'
import EditProductForm from './EditProductForm'

const EditProductModal = ({isActive, productId, resetActiveModal, onUpdateSuccess}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitForm, setSubmitForm] = useState(false);

    const handleOk = () => {
        setSubmitForm(true);
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSubmitForm(false);
        })
    }

    const handleCancel = () => {
        setOpen(false);
        resetActiveModal();
    }

    const handleSubmitSuccess = (msg) => {
        onUpdateSuccess(msg);
        setOpen(false);
        resetActiveModal();
    }

    useEffect(() => {
        if (isActive) {
            setOpen(true);
        }   
    }, [isActive, productId]);

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
            <EditProductForm
                productId={productId}
                isSubmit={submitForm}
                onSubmitSuccess={handleSubmitSuccess}
            />
        </Modal>
    )
}

export default EditProductModal
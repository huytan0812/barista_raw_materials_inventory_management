import React, {useState, useEffect} from 'react'
import { Modal, Button } from 'antd'
import EditProductForm from './EditProductForm'

const EditProductModal = ({isActive, productId, resetActiveModal}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitForm, setSubmitForm] = useState(false);
    const [resetForm, setResetForm] = useState(false);

    const handleOk = () => {
        setOpen(false);
        resetActiveModal();
    }

    const handleCancel = () => {
        setOpen(false);
        resetActiveModal();
    }

    useEffect(() => {
        if (isActive) {
            setOpen(true);
            console.log("Product id:", productId);
        }   
    }, [isActive, productId]);

    return (
        <Modal
            title="Sửa"
            open={open}
            style={{
                fontSize: '1.4rem',
            }}
            footer={
            <>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" onClick={handleOk}>
                    Xác nhận
                </Button>
            </>
            }
        >
            <EditProductForm />
        </Modal>
    )
}

export default EditProductModal
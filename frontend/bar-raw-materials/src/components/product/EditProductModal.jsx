import React, {useState, useEffect} from 'react'
import { Modal, Button, Form } from 'antd'
import EditProductForm from './EditProductForm'

const EditProductModal = (props) => {
    const {
        isActive, 
        productId, 
        resetActiveModal, 
        onUpdateSuccess
    } = props;

    // states for handling modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // state for handling form
    const [editProductForm] = Form.useForm();

    const handleOk = () => {
        editProductForm.submit();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
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
            title="Cập nhật sản phẩm"
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
                onSubmitSuccess={handleSubmitSuccess}
                form={editProductForm}
            />
        </Modal>
    )
}

export default EditProductModal
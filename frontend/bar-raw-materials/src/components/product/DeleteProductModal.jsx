import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'antd'
import { WarningFilled } from '@ant-design/icons';
import { useAuthContext } from '../../contexts/AuthContext';
import axiosHTTP from '../../services/ProductService';


const DeleteProductModal = ({isActive, 
        resetActiveModal, 
        productId, 
        productName,
        onDeleteSuccess
    }) => {
    const [open, setOpen] = useState(false);
    const { token } = useAuthContext();

    const handleOk = () => {
        const deleteProduct = async() => {
            const response = await axiosHTTP.get(`/delete/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response);
            if (response.status === 200) {
                setOpen(false);
                resetActiveModal();
                onDeleteSuccess(response.data.successfulMsg);
            }
            else {
                console.log(response.body);
            }
        }
        deleteProduct();   
    };
    const handleCancel = () => {
        setOpen(false);
        resetActiveModal();
    };

    useEffect(() => {
        if (isActive) {
            setOpen(true);
        }
    }, [isActive]);

    return (
        <Modal
            title={
                <p>
                    <WarningFilled
                        style={{
                            fontSize: '3.2rem',
                            color: '#E9D502'
                        }}
                    />
                    <span style={{fontWeight: 600, marginLeft: '1rem'}}>Xóa sản phẩm</span>
                </p>
            }
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
                <Button color="red" variant="solid" onClick={handleOk}>
                    Xác nhận
                </Button>
            </>
            }
        >
            <p style={{ fontSize: '1.4rem' }}>
                Bạn có muốn xóa sản phẩm <strong style={{fontSize: '1.4rem'}}>{productName}</strong> không?
            </p>
        </Modal>
    )
}

export default DeleteProductModal
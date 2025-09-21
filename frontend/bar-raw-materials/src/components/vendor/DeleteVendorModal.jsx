import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'antd'
import { WarningFilled } from '@ant-design/icons'
import { useAuthContext } from '../../contexts/AuthContext'
import vendorHTTP from '../../services/VendorService'

const DeleteVendorModal = (props) => {
  const {
        isActive,
        resetActiveDeleteModal, 
        vendorId, 
        vendorName,
        failMsg,
        onDeleteSuccess
    } = props;
    const [open, setOpen] = useState(false);
    const { token } = useAuthContext();

    const handleOk = () => {
        const deleteVendor = async() => {
            try {
                const response = await vendorHTTP.get(`/delete/${vendorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setOpen(false);
                    onDeleteSuccess(response.data);
                }
            }
            catch (error) {
                failMsg(error.response.data);
            }
        }
        deleteVendor();   
    };
    const handleCancel = () => {
        setOpen(false);
        resetActiveDeleteModal();
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
                    <span style={{fontWeight: 600, marginLeft: '1rem'}}>Xóa nhà cung cấp</span>
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
                Bạn có muốn xóa nhà cung cấp <strong style={{fontSize: '1.4rem'}}>{vendorName}</strong> không?
            </p>
        </Modal>
    )
}

export default DeleteVendorModal
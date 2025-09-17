import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'antd'
import { WarningFilled } from '@ant-design/icons'
import { useAuthContext } from '../../../contexts/AuthContext'
import grnItemHTTP from '../../../services/GoodsReceiptItemService'

const DeleteGrnItemModal = (props) => {
    const {
        isActive,
        resetActiveDeleteModal, 
        grnItemId, 
        lotNumber,
        failMsg,
        onDeleteSuccess
    } = props;
    const [open, setOpen] = useState(false);
    const { token } = useAuthContext();

    const handleOk = () => {
        const deleteGrnItem = async() => {
            try {
                const response = await grnItemHTTP.get(`/delete/${grnItemId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setOpen(false);
                    onDeleteSuccess(response.data.successfulMsg);
                }
                else {
                    console.log(response.body);
                }
            }
            catch (error) {
                console.log(error);
                failMsg(error.response.data.failToDelete);
            }
        }
        deleteGrnItem();   
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
                    <span style={{fontWeight: 600, marginLeft: '1rem'}}>Xóa lô hàng</span>
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
                Bạn có muốn xóa lô hàng <strong style={{fontSize: '1.4rem'}}>{lotNumber}</strong> không?
            </p>
        </Modal>
    )
}

export default DeleteGrnItemModal
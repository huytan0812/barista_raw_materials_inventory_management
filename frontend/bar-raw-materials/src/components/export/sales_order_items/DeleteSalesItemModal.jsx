import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'antd'
import { WarningFilled } from '@ant-design/icons'
import { useAuthContext } from '../../../contexts/AuthContext'
import salesItemHTTP from '../../../services/SalesOrderItemService'

const DeleteSalesItemModal = (props) => {
    const {
        isActive,
        resetActiveDeleteModal,
        productName, 
        salesItemId, 
        popUpMsg,
        onDeleteSuccess
    } = props;
    const [open, setOpen] = useState(false);
    const { token } = useAuthContext();

    const handleOk = () => {
        const deleteSalesItem = async() => {
            try {
                const response = await salesItemHTTP.get(`/delete/${salesItemId}`, {
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
                const responseErr = error.response;
                popUpMsg('error', responseErr?.data);
            }
        }
        deleteSalesItem();   
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
                    <span style={{fontWeight: 600, marginLeft: '1rem'}}>Xóa đơn hàng bán</span>
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
                Bạn có muốn xóa đơn hàng bán sản phẩm  
                <strong style={{fontSize: '1.4rem'}}>{productName}</strong> không?
            </p>
        </Modal>
    )
}

export default DeleteSalesItemModal
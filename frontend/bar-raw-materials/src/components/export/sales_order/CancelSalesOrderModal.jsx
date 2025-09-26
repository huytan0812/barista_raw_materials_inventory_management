import React from 'react'
import {Modal, Button} from 'antd'
import { WarningFilled } from '@ant-design/icons'
import { useAuthContext } from '../../../contexts/AuthContext'
import salesOrderHTTP from '../../../services/SalesOrderService'

const CancelSalesOrderModal = (props) => {
    const {
        salesOrderId, 
        popUpMsg,
        onCancelSuccess,
        open,
        setOpen
    } = props;
    const { token } = useAuthContext();

    const handleOk = () => {
        const deleteGrnItem = async() => {
            try {
                const response = await salesOrderHTTP.get(`/delete/${salesOrderId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setOpen(false);
                    onCancelSuccess(response.data);
                }
            }
            catch (error) {
                const responseErr = error.response;
                popUpMsg('error', responseErr?.data);
            }
        }
        deleteGrnItem();   
    };
    const handleCancel = () => {
        setOpen(false);
    };

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
                    <span style={{fontWeight: 600, marginLeft: '1rem'}}>Hủy phiếu xuất</span>
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
                Bạn có hủy phiếu xuất với mã số <strong style={{fontSize: '1.4rem'}}>{salesOrderId}</strong> không?
            </p>
        </Modal>
    )
}

export default CancelSalesOrderModal
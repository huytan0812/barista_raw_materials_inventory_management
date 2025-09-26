import React from 'react'
import {Modal, Button} from 'antd'
import { WarningFilled } from '@ant-design/icons'
import { useAuthContext } from '../../../contexts/AuthContext'
import salesOrderHTTP from '../../../services/SalesOrderService'

const ConfirmSalesOrderModal = (props) => {
    const {
      salesOrderId, 
      popUpMsg,
      onConfirmSuccess,
      open,
      setOpen
    } = props;
    const { token } = useAuthContext();

    const handleOk = () => {
        const deleteGrnItem = async() => {
            try {
                const response = await salesOrderHTTP.get(`/confirm/${salesOrderId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setOpen(false);
                    onConfirmSuccess(response.data);
                }
                else {
                    console.log(response.body);
                }
            }
            catch (error) {
                console.log(error);
                popUpMsg('error', "Duyệt phiếu xuất kho thất bại");
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
                    <span style={{fontWeight: 600, marginLeft: '1rem'}}>Duyệt phiếu xuất</span>
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
                Vui lòng kiểm tra kỹ trước khi phê duyệt. Một khi phê duyệt thành công sẽ không chỉnh sửa được nữa
            </p>
        </Modal>
    )
}

export default ConfirmSalesOrderModal
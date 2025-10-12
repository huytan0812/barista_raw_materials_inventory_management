import React, {useState, useEffect} from 'react'
import {Form, Modal, Button} from 'antd' 
import ResetPasswordForm from './ResetPasswordForm';

const ResetPasswordModal = (props) => {
    const {
        username,
        userId,
        isActive,
        resetActiveResetModal,
        popUpMsg
    } = props;
    const [open, setOpen] = useState(false);
    const [resetPasswordForm] = Form.useForm();

    const handleOk = () => {
        resetPasswordForm.submit();
    };
    const handleCancel = () => {
        resetActiveResetModal(0);
        setOpen(false);
    };
    const handleResetFailure = () => {
        popUpMsg('error', "Cấp lại mật khẩu thất bại");
    };
    const handleResetSuccess = () => {
        resetActiveResetModal(0);
        setOpen(false);
        popUpMsg('success', "Cấp lại mật khẩu thành công");
    };
    useEffect(() => {
        if (isActive) setOpen(true);
    }, [isActive])

    return (
        <Modal
            title={`Cấp lại mật khẩu cho tài khoản nhân viên ${username}`}
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
                <Button type="primary" onClick={handleOk}>
                    Xác nhận
                </Button>
            </>
            }
        >
            <ResetPasswordForm
                form={resetPasswordForm}
                userId={userId}
                onResetFailure={handleResetFailure}
                onResetSuccess={handleResetSuccess}
            />
        </Modal>
    )
}

export default ResetPasswordModal
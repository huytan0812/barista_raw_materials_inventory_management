import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'antd'
import EditAccountForm from './EditAccountForm'

const EditAccountModal = (props) => {
    const {
        user,
        isActive,
        resetActiveEditModal,
        popUpMsg,
        setRefreshUsers
    } = props;
    // state for handling form
    const [editAccountForm] = Form.useForm();
    // states for handling modal
    const [open, setOpen] = useState(false);

    const handleOk = () => {
        editAccountForm.submit();
    }
    const handleCancel = () => {
        setOpen(false);
        resetActiveEditModal();
        editAccountForm.resetFields();
    }
    const handleEditFailure = () => {
        popUpMsg('error', "Cập nhật tài khoản thất bại");
    }
    const handleEditSuccess = () => {
        editAccountForm.resetFields();
        setOpen(false);
        resetActiveEditModal();
        setRefreshUsers(prev=>!prev);
        popUpMsg('success', "Cập nhật tài khoản thành công");
    };

    useEffect(() => {
        if (isActive) setOpen(true)
    }, [isActive]);

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
                <Button type="primary" onClick={handleOk}>
                    Xác nhận
                </Button>
            </>
            }
        >
            <EditAccountForm
                form={editAccountForm}
                formName={`edit_account_${user?.id}`}
                user={user}
                onEditFailure={handleEditFailure}
                onEditSuccess={handleEditSuccess}
            />
        </Modal>
    )
}

export default EditAccountModal
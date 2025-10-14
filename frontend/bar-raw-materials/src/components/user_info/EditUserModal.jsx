import React, {useState} from 'react'
import {Modal, Button, Form} from 'antd'
import EditUserForm from './EditUserForm';

const EditUserModal = (props) => {
    const {
        user,
        popUpMsg,
        setRefreshUser,
        open,
        setOpen
    } = props;
    // state for handling form
    const [editUserForm] = Form.useForm();

    const handleOk = () => {
        editUserForm.submit();
    }
    const handleCancel = () => {
        setOpen(false);
        editUserForm.resetFields();
    }
    const handleEditFailure = () => {
        popUpMsg('error', "Cập nhật tài khoản thất bại");
    }
    const handleEditSuccess = () => {
        editUserForm.resetFields();
        setOpen(false);
        setRefreshUser(prev=>!prev);
        popUpMsg('success', "Cập nhật tài khoản thành công");
    };

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
            <EditUserForm
                form={editUserForm}
                formName={`edit_user_${user?.id}`}
                user={user}
                onEditFailure={handleEditFailure}
                onEditSuccess={handleEditSuccess}
            />
        </Modal>
    )
}

export default EditUserModal
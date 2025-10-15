import React, {useState} from 'react'
import {Form, Modal, Button} from 'antd'
import { useNavigate } from 'react-router-dom'
import { useMessageContext } from '../../contexts/MessageContext'
import CheckPasswordForm from './CheckPasswordForm'
import ChangePasswordForm from './ChangePasswordForm'

const ChangePasswordModal = (props) => {
    const {
        user,
        popUpMsg,
        open,
        setOpen
    } = props;
    const navigate = useNavigate();
    const {setMessage} = useMessageContext();
    const [changePasswordForm] = Form.useForm();
    const [checkedPassword, setCheckedPassword] = useState(false);

    const handleOk = () => {
        changePasswordForm.submit();
    }
    const handleCancel = () => {
        setOpen(false);
        setCheckedPassword(false);
        changePasswordForm.resetFields();
    }
    const handleChangePasswordFailure = () => {
        popUpMsg('error', "Đổi mật khẩu thất bại");
    }
    const handleChangePasswordSuccess = () => {
        setOpen(false);
        setCheckedPassword(false);
        changePasswordForm.resetFields();
        popUpMsg('success', "Đổi mật khẩu thành công");
        // update message in MessageContext
        setMessage("Đổi mật khẩu thành công, vui lòng đăng nhập lại");
        navigate('/login');
    };
    
    return (
        <Modal
            title="Đổi mật khẩu"
            open={open}
            style={{
                fontSize: '1.4rem',
            }}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnHidden={true}
            footer={
                checkedPassword && 
                <React.Fragment>
                    <Button onClick={handleCancel}>Hủy</Button>
                    <Button type="primary" onClick={handleOk}>
                        Xác nhận
                    </Button>
                </React.Fragment>
            }
        >
            {
                checkedPassword ? 
                <ChangePasswordForm
                    userId={user?.id}
                    form={changePasswordForm}
                    onChangeFailure={handleChangePasswordFailure}
                    onChangeSuccess={handleChangePasswordSuccess}
                />
                :
                <CheckPasswordForm
                    userId={user?.id}
                    setCheckedPassword={setCheckedPassword}
                    popUpMsg={popUpMsg}
                />
            }    
        </Modal>
    )
}

export default ChangePasswordModal
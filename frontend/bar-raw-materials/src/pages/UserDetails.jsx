import React, {useState, useEffect, useRef} from 'react'
import { Card, Avatar, Descriptions, Row, Col, Button, message } from "antd";
import { useAuthContext } from '../contexts/AuthContext';
import userHTTP from '../services/UserService'
import EditUserModal from '../components/user_info/EditUserModal'
import ChangePasswordModal from '../components/user_info/ChangePasswordModal';

const UserDetails = () => {
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [user, setUser] = useState({});
    const [refreshUser, setRefreshUser] = useState(false);
    const [messageAPI, contextHolder] = message.useMessage();

    // state for handling edit modal
    const [openEditModal, setOpenEditModal] = useState(false);

    // state for handling change password modal
    const [changePasswordModal, setChangePasswordModal] = useState(false);

    const popUpMsg = (type, msg) => {
        messageAPI.open({
            type: type,
            content: msg
        })
    };

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await userHTTP.get('/lightInfo', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setUser(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchUser();
    }, [refreshUser]);

    return (
        <React.Fragment>
            {contextHolder}
            <Card
                className="mb-6 shadow-md rounded-2xl"
                title={
                    <span style={{ fontWeight: "bold" }}>Thông tin nhân viên</span>
                }
                extra={
                    <React.Fragment>
                        <Button
                            color="primary"
                            variant="solid"
                            onClick={() => setOpenEditModal(true)}
                        >
                            Sửa
                        </Button>
                        <EditUserModal
                            user={user}
                            setRefreshUser={setRefreshUser}
                            popUpMsg={popUpMsg}
                            open={openEditModal}
                            setOpen={setOpenEditModal}
                        />
                        <Button
                            color="primary"
                            variant="solid"
                            style={{
                                marginLeft: '0.8rem'
                            }}
                            onClick={() => {setChangePasswordModal(true)}}
                        >
                            Đổi mật khẩu
                        </Button>
                        <ChangePasswordModal
                            user={user}
                            popUpMsg={popUpMsg}
                            open={changePasswordModal}
                            setOpen={setChangePasswordModal}
                        />
                    </React.Fragment>
                }
            >
                <Row gutter={24} align="middle">
                    <Col span={18}>
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Username">{user?.username}</Descriptions.Item>
                            <Descriptions.Item label="Họ và tên">{user?.firstName} {user?.lastName}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                            <Descriptions.Item label="SĐT">{user?.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Giới tính">
                                {
                                    user?.gender ? "Nam" : "Nữ"
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Vai trò">
                                {user?.role?.role}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={6}>
                        <Avatar
                            size={100}
                            src={`http://localhost:8080/api/image/default_avatar.png`}
                            style={{ border: "2px solid #f0f0f0" }}
                        />
                    </Col>
                </Row>
            </Card>
        </React.Fragment>
    )
}

export default UserDetails
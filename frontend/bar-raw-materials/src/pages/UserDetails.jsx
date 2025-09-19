import React, {useState, useEffect, useRef} from 'react'
import { Card, Avatar, Descriptions, Row, Col } from "antd";
import { useAuthContext } from '../contexts/AuthContext';
import userHTTP from '../services/UserService'

const UserDetails = () => {
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [user, setUser] = useState({});
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
    }, []);

    return (
        <Card
            className="mb-6 shadow-md rounded-2xl"
            title={
                <span style={{ fontWeight: "bold" }}>Thông tin nhân viên</span>
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
                        {user?.role}
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
    )
}

export default UserDetails
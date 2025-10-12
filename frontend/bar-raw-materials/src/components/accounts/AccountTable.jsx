import React, {useState, useEffect, useRef} from 'react'
import {Table, Button, Flex, Tag} from 'antd'
import EditAccountModal from './EditAccountModal'
import ResetPasswordModal from './ResetPasswordModal'
import { useAuthContext } from '../../contexts/AuthContext'
import userHTTP from '../../services/UserService'

const AccountTable = (props) => {
    const {
        currentPage,
        pageSize,
        setPageMetadata,
        refreshUsers,
        setRefreshUsers,
        popUpMsg
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [users, setUsers] = useState([]);
    const [activeEditModal, setActiveEditModal] = useState(0);
    const [activeResetModal, setActiveResetModal] = useState(0);
    
    const handleEditClick = (userId) => {
        setActiveEditModal(parseInt(userId));
    };
    const handleResetClick = (userId) => {
        setActiveResetModal(parseInt(userId));
    };

    useEffect(() => {
        const fetchUsers = async() => {
            try {
                const response = await userHTTP.get('/list', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        page: currentPage - 1,
                        size: pageSize
                    }
                });
                if (response.status === 200) {
                    setUsers(response.data.content);
                    const {content:_, ...rest} = response.data;
                    setPageMetadata(rest);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchUsers();
    }, [currentPage, pageSize, refreshUsers]);

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1,
            align: "center"
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            align: "center"
        },
        {
            title: "Tên nhân viên",
            key: "fullname",
            render: (_,record) => {
                return (
                    `${record.firstName} ${record.lastName}`
                )
            },
            width: "15rem",
            align: "center"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            align: "center"
        },
        {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            align: "center"
        },
        {
            title: "Vai trò",
            key: "role",
            render: (_,record) => {
                return (record.role?.role)
            },
            align: "center"
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (_,record) => {
                return record.isActive ? 
                <Tag color="green">Đã kích hoạt</Tag> 
                : 
                <Tag color="red">Chưa kích hoạt</Tag> 
            },
            align: "center"
        },
        {
            title: "Hành động",
            key: "action",
            render: (record) => {
                return (
                  <Flex gap="1rem" justify='center'>
                    <Button 
                        color="blue" 
                        variant="solid" 
                        value={record.id}
                        onClick={() => handleEditClick(record.id)}
                    >
                        <span style={{fontSize: '1.4rem'}}>Sửa</span>
                    </Button>
                    <EditAccountModal
                        isActive={record.id === activeEditModal}
                        user={record}
                        resetActiveEditModal={() => setActiveEditModal(0)}
                        popUpMsg={popUpMsg}
                        setRefreshUsers={setRefreshUsers}
                    />
                    <Button
                        color="default"
                        variant="outlined"
                        onClick={() => handleResetClick(record.id)}
                    >
                        <span style={{fontSize: '1.4rem'}}>Reset MK</span>
                    </Button>
                    <ResetPasswordModal
                        isActive={activeResetModal===record.id}
                        username={record.username}
                        userId={record.id}
                        resetActiveResetModal={() => setActiveResetModal(0)}
                        popUpMsg={popUpMsg}
                    />
                  </Flex>
                )
            },
            align: "center"
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={users?.map(record => ({...record, key: record.id}))}
            pagination={false}
        />
    )
}

export default AccountTable
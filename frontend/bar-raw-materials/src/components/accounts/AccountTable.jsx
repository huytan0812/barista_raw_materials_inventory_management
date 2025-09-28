import React, {useState, useEffect, useRef} from 'react'
import {Table, Button, Modal, Flex} from 'antd'
import { useAuthContext } from '../../contexts/AuthContext'
import userHTTP from '../../services/UserService'

const AccountTable = (props) => {
    const {
        currentPage,
        pageSize,
        setPageMetadata,
        refreshUsers,
        setRefreshUsers
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [users, setUsers] = useState([]);
    
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
    }, [currentPage, pageSize, refreshUsers])

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
            title: "Hành động",
            key: "action",
            render: (record) => {
                return (
                  <Flex gap="1rem">
                    <Button 
                        color="blue" 
                        variant="solid" 
                        value={record.productId}
                    >
                        <span style={{fontSize: '1.4rem'}}>Sửa</span>
                    </Button>
                    <Button 
                        color="red" 
                        variant="solid"
                    >
                      <span value={record.productId} style={{fontSize: '1.4rem'}}>Xóa</span>
                    </Button>
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
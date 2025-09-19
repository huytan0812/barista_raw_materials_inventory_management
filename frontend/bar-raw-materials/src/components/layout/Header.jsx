import React, {useState, useEffect, useRef} from 'react'
import { Header } from 'antd/es/layout/layout'
import { useLayoutContext } from '../../contexts/LayoutContext'
import { BellOutlined, UserOutlined, SettingFilled, LogoutOutlined } from '@ant-design/icons'
import { Avatar, Divider, Flex, Dropdown, Tag } from 'antd'
import { useAuthContext } from '../../contexts/AuthContext.jsx'
import { useNavigate, NavLink } from 'react-router-dom'
import userHTTP from '../../services/UserService.js'

const notifyItems = [
  {
    key: '1',
    label: (
      <a href="#">
        Thông báo 1
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a href="#">
        Thông báo 2
      </a>
    ),
  }
];

const ImsHeader = () => {
    const navigate = useNavigate();
    const { colorBgContainer } = useLayoutContext();
    const { logout, token } = useAuthContext();
    const persistToken = useRef(token);
    const [businessPeriod, setBusinessPeriod] = useState(null);
    const [userInfo, setUserInfo] = useState({});

    // side effect for fetching current business period
    useEffect(() => {
        const getBusinessPeriod = async() => {
            const response = await fetch('http://localhost:8080/api/staff/businessPeriod/current', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${persistToken.current}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setBusinessPeriod(data);
            }
        }
        getBusinessPeriod();
    }, []);

    // side effect for fetching current login user
    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await userHTTP.get('lightInfo', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setUserInfo(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchUser();
    }, []);

    const handleLogoutClick = () => {
        logout();
        console.log("Đăng xuất thành công");
        navigate('/login');
    }

    const settingItems = [
        {
            key: '1',
            label: (
                <NavLink to='/userDetails'>
                    <span>Hồ sơ cá nhân</span>
                </NavLink>
            ),
        },
        {
            key: '2',
            label: (
                <a 
                    href="#" 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    onClick={handleLogoutClick}
                >
                    <LogoutOutlined />
                    <span style={{ marginLeft: '1rem'}}>Đăng xuất</span>
                </a>
            ),
        }
    ];
    
    return (
        <Header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px', 
            background: colorBgContainer 
        }}>
            <div>
                <p>
                    <strong style={{fontSize: '2.4rem'}}>
                        Bar Raw Materials Inventory Management
                    </strong>
                </p>
            </div>
            <div>
                <p>
                    {businessPeriod ? <Tag color="geekblue">{businessPeriod.label}</Tag> : 'Đang tải kỳ kinh doanh...'}
                </p>
            </div>
            <Flex
                style={{
                    alignItems: 'center'
                }}
            >
                <div 
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Dropdown
                        menu={{items: notifyItems}}
                        placement='bottomRight'
                        trigger={["click"]}
                        arrow
                    >
                        <BellOutlined 
                            style={{ 
                                fontSize: '3.2rem',
                                cursor: 'pointer' 
                            }}
                        />
                    </Dropdown>
                </div>
                    <Divider 
                        variant='solid' 
                        type="vertical" 
                        style={{ 
                            fontSize: '24px', 
                            borderColor: 'rgba(0, 0, 0, 1)',
                            marginright: '8px' 
                        }}
                    />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}>
                    <Avatar 
                        shape="square" 
                        size={36} 
                        icon={<UserOutlined />}
                        style = {{
                            marginRight: '8px'
                        }} 
                    />
                    <Flex
                        vertical
                        style={{
                            lineHeight: '16px',
                            marginRight: '8px'
                        }}
                    > 
                        <p
                            style={{
                                fontSize: '12px',

                            }}
                        >
                            {userInfo?.username}
                        </p>
                        <p
                            style={{
                                fontSize: '12px',

                            }}
                        >
                            <strong>
                                {userInfo?.role}
                            </strong>
                        </p>
                    </Flex>   
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Dropdown
                        menu={{ items: settingItems }}
                        placement="bottomRight"
                        trigger={["click"]} // ensures it only opens when clicked
                        arrow
                    >
                        <SettingFilled
                            style={{
                            fontSize: "3.2rem",
                            color: "#002140",
                            cursor: "pointer",
                            }}
                        />
                    </Dropdown>
                </div>
            </Flex>
        </Header>
    )
}

export default ImsHeader
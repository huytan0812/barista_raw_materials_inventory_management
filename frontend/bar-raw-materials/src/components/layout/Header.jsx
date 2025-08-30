import React from 'react'
import { Header } from 'antd/es/layout/layout'
import { useLayoutContext } from '../../contexts/LayoutContext'
import { BellOutlined, UserOutlined, SettingFilled, LogoutOutlined } from '@ant-design/icons'
import { Avatar, Divider, Flex, Dropdown } from 'antd'
import { useAuthContext } from '../../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

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
    const { logout } = useAuthContext();

    const handleLogoutClick = () => {
        logout();
        console.log("Đăng xuất thành công");
        navigate('/login');
    }

    const settingItems = [
        {
            key: '1',
            label: (
            <a href="#">
                Hồ sơ cá nhân
            </a>
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
                            Nguyen Van A
                        </p>
                        <p
                            style={{
                                fontSize: '12px',

                            }}
                        >
                            <strong>
                                Admin
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
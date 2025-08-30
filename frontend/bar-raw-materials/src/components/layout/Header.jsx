import React from 'react'
import { Header } from 'antd/es/layout/layout'
import { useLayoutContext } from '../../contexts/LayoutContext'
import { BellOutlined, UserOutlined, SettingFilled, LogoutOutlined } from '@ant-design/icons'
import { Avatar, Divider, Flex, Dropdown } from 'antd'

const items = [
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
      <a href="#">
        <LogoutOutlined />
        <span>Đăng xuất</span>
      </a>
    ),
  }
];

const ImsHeader = () => {
    const { colorBgContainer } = useLayoutContext();
    
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
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <BellOutlined 
                        style={{ 
                            fontSize: '3.2rem',
                            cursor: 'pointer' 
                        }}/>
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
                        menu={{ items }}
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
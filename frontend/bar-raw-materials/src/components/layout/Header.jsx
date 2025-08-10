import React from 'react'
import { Header } from 'antd/es/layout/layout'
import { useLayoutContext } from '../../contexts/LayoutContext'
import { BellOutlined, UserOutlined, SettingFilled } from '@ant-design/icons'
import { Avatar, Divider, Flex } from 'antd'

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
                <div>
                    <BellOutlined 
                        style={{ 
                            fontSize: '18px',
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
                    <SettingFilled 
                        style={{ 
                            fontSize: '24px', 
                            color: '#002140',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </Flex>
        </Header>
    )
}

export default ImsHeader
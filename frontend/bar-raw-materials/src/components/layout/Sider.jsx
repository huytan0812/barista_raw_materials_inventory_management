import { JavaScriptOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import ImsMenu from './Menu';
import { Layout } from 'antd';

const { Sider } = Layout;

const ImsSider = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
            <div className="demo-logo-vertical" style = {{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
            }}>
                    <JavaScriptOutlined style={{ fontSize: '32px', color: '#fff' }} />
            </div>
            <ImsMenu />
        </Sider>
    )
}

export default ImsSider
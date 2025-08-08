import React from 'react'
import { Content } from 'antd/es/layout/layout';
import { useLayoutContext } from '../../contexts/LayoutContext';
import { Outlet } from 'react-router-dom';

const ImsContent = () => {
    const { colorBgContainer, borderRadiusLG } = useLayoutContext();

    return (
        <Content style={{ margin: '16px 16px' }}>
            <div
                style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                }}
            >
                <Outlet />
            </div>
        </Content>
    )
}

export default ImsContent
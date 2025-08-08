import React from 'react'
import { Footer } from 'antd/es/layout/layout'

const ImsFooter = () => {
    return (
        <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
    )
}

export default ImsFooter
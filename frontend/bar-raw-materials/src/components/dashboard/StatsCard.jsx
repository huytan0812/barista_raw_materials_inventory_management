import React from 'react'
import {Row, Col, Card} from 'antd'
import { DollarCircleOutlined, RiseOutlined, ShoppingCartOutlined, UserAddOutlined } from '@ant-design/icons';

const StatsCard = () => {
    const stats = [
        { title: 'Doanh thu', value: '$12,340', icon: <DollarCircleOutlined style={{ fontSize: 30, color: '#3f8600' }} />, color: '#f6ffed' },
        { title: 'Lợi nhuận', value: '$4,560', icon: <RiseOutlined style={{ fontSize: 30, color: '#cf1322' }} />, color: '#fff1f0' },
        { title: 'Đơn bán hàng', value: '1,230', icon: <ShoppingCartOutlined style={{ fontSize: 30, color: '#096dd9' }} />, color: '#e6f7ff' },
        { title: 'Khách hàng mới', value: '320', icon: <UserAddOutlined style={{ fontSize: 30, color: '#531dab' }} />, color: '#f9f0ff' },
    ];

    return (
        <React.Fragment>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                {stats.map((item, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
                        <Card style={{ backgroundColor: item.color }}>
                        <Row align="middle" gutter={16}>
                            <Col>{item.icon}</Col>
                            <Col>
                            <h3>{item.title}</h3>
                            <p style={{ fontSize: 18, fontWeight: 'bold' }}>{item.value}</p>
                            </Col>
                        </Row>
                        </Card>
                    </Col>
                ))}
            </Row>
        </React.Fragment>
  )
}

export default StatsCard
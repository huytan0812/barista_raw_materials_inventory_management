import React from 'react'
import {Row, Col, Card, List, Avatar} from 'antd'

const Tables = () => {
    const products = [
        { name: 'Product A', qty: 500 },
        { name: 'Product B', qty: 350 },
        { name: 'Product C', qty: 300 },
        { name: 'Product D', qty: 250 },
    ];
    return (
        <Row gutter={16} style={{marginTop: '1.6rem'}}>
            <Col xs={24} md={8}>
            <Card title="Top Seller Products">
                <List
                dataSource={products}
                renderItem={(item) => (
                    <List.Item>
                    <List.Item.Meta avatar={<Avatar>{item.name.charAt(0)}</Avatar>} title={item.name} />
                    <div>{item.qty}</div>
                    </List.Item>
                )}
                />
            </Card>
            </Col>
            <Col xs={24} md={8}>
            <Card title="Slow Seller Products">
                <List
                dataSource={[...products].reverse()}
                renderItem={(item) => (
                    <List.Item>
                    <List.Item.Meta avatar={<Avatar>{item.name.charAt(0)}</Avatar>} title={item.name} />
                    <div>{item.qty}</div>
                    </List.Item>
                )}
                />
            </Card>
            </Col>
            <Col xs={24} md={8}>
            <Card title="Low Quantity Products">
                <List
                dataSource={products.filter((p) => p.qty < 300)}
                renderItem={(item) => (
                    <List.Item>
                    <List.Item.Meta avatar={<Avatar>{item.name.charAt(0)}</Avatar>} title={item.name} />
                    <div>{item.qty}</div>
                    </List.Item>
                )}
                />
            </Card>
            </Col>
        </Row>
    )
}

export default Tables
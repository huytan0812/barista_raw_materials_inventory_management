import React, {useState, useEffect, useRef} from 'react'
import {Row, Col, Card, List, Avatar} from 'antd'
import {useAuthContext} from '../../contexts/AuthContext'
import productInvHTTP from '../../services/ProductInventory'

const Tables = () => {
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [topSellers, setTopSellers] = useState([]);
    const [slowSellers, setSlowSellers] = useState([]);

    // side effect for fetching top sellers
    useEffect(() => {
        const fetchTopSellers = async() => {
            try {
                const response = await productInvHTTP.get('getExportQuantity', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        limit: 5,
                        DESC: true
                    }
                });
                if (response.status === 200) {
                    setTopSellers(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchTopSellers();
    }, []);

    // side effect for fetching slow sellers
    useEffect(() => {
        const fetchSlowSellers = async() => {
            try {
                const response = await productInvHTTP.get('getExportQuantity', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        limit: 5,
                        DESC: false
                    }
                });
                if (response.status === 200) {
                    setSlowSellers(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchSlowSellers();
    }, []);

    return (
        <Row gutter={16} style={{marginTop: '1.6rem'}}>
            <Col xs={24} md={8}>
            <Card title="Hàng bán chạy">
                <List
                    dataSource={topSellers}
                    renderItem={(item) => (
                        <List.Item>
                        <List.Item.Meta avatar={<Avatar>{item.productName?.charAt(0)}</Avatar>} title={item.productName} />
                        <div>{item.exportQuantity}</div>
                        </List.Item>
                    )}
                />
            </Card>
            </Col>
            <Col xs={24} md={8}>
            <Card title="Hàng bán chậm">
                <List
                    dataSource={slowSellers}
                    renderItem={(item) => (
                        <List.Item>
                        <List.Item.Meta avatar={<Avatar>{item.productName?.charAt(0)}</Avatar>} title={item.productName} />
                        <div>{item.exportQuantity}</div>
                        </List.Item>
                    )}
                />
            </Card>
            </Col>
            <Col xs={24} md={8}>
            <Card title="Hàng sắp hết">
                <List
                    dataSource={slowSellers?.filter((p) => p.qty < 300)}
                    renderItem={(item) => (
                        <List.Item>
                        <List.Item.Meta avatar={<Avatar>{item.productName?.charAt(0)}</Avatar>} title={item.productName} />
                        <div>{item.exportQuantity}</div>
                        </List.Item>
                    )}
                />
            </Card>
            </Col>
        </Row>
    )
}

export default Tables
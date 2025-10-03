import React, {useState, useEffect, useRef} from 'react'
import {Row, Col, Card} from 'antd'
import { DollarCircleOutlined, RiseOutlined, ShoppingCartOutlined, UserAddOutlined } from '@ant-design/icons'
import { useAuthContext } from '../../contexts/AuthContext'
import productInvHTTP from '../../services/ProductInventory'

const VATCards = () => {
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [VAT, setVAT] = useState({});
    const payVAT = (VAT.totalInputVAT && VAT.totalOutputVAT) ? VAT.totalOutputVAT - VAT.totalInputVAT : 0;

    useEffect(() => {
        const fetchVAT = async() => {
            try {
                const response = await productInvHTTP.get('vatOverall', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setVAT(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchVAT();
    }, []);

    const stats = [
        { 
            title: 'Thuế GTGT phải nộp',
            value: new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(payVAT), 
            icon: <DollarCircleOutlined style={{ fontSize: 30, color: '#3f8600' }} />, 
            color: '#f6ffed' 
        },
        { 
            title: 'VAT đầu vào', 
            value: new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(VAT?.totalInputVAT), 
            icon: <DollarCircleOutlined style={{ fontSize: 30, color: '#cf1322' }} />, 
            color: '#fff1f0' 
        },
        { 
            title: 'VAT đầu ra', 
            value: new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(VAT?.totalOutputVAT), 
            icon: <DollarCircleOutlined style={{ fontSize: 30, color: '#096dd9' }} />, 
            color: '#e6f7ff' 
        }
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

export default VATCards
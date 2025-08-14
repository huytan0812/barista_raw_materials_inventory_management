import React, {useState, useEffect, useRef} from 'react'
import {Row, Col, Card, Select} from 'antd'
import RevenueChart from './RevenueChart'
import InventoryChart from './InventoryChart'
import { useContainerReady } from '../../hooks/useContainerReady'

const { Option } = Select;

const MainCharts = () => {
    const lineCardRef = useRef(null);
    const pieCardRef = useRef(null);
    const isLineCardReady = useContainerReady(lineCardRef);
    const isPieCardReady = useContainerReady(pieCardRef);

    const [filter, setFilter] = useState('month');
    // use prop and state to pass chartHeight to RevenueChart and InventoryChart
    const [chartHeight, setChartHeight] = useState(Math.max(window.innerHeight * 0.35, 250)); // min 250px
    
    // Update chart height on window resize
    useEffect(() => {
    const handleResize = () => {
        setChartHeight(Math.max(window.innerHeight * 0.35, 250));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div id="main-charts" style={{marginTop: '1.6rem'}}>
            <Row gutter={16}>
                <Col xs={24} lg={16}>
                    <Card
                        title="Doanh thu"
                        extra={
                            <Select defaultValue={filter} onChange={setFilter} style={{ width: '12rem' }}>
                                <Option value="day">Ngày</Option>
                                <Option value="week">Tuần</Option>
                                <Option value="month">Tháng</Option>
                                <Option value="year">Năm</Option>
                            </Select>
                        }
                        ref={lineCardRef}
                    >
                        {isLineCardReady && <RevenueChart chartHeight={chartHeight} />}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Tỷ lệ hàng tồn kho" ref={pieCardRef}>
                        {isPieCardReady && <InventoryChart chartHeight={chartHeight} />}
                    </Card>
                </Col>
        </Row>
        </div>
    )
}

export default MainCharts
import React, {useState, useEffect, useRef} from 'react'
import {Row, Col, Card, Select} from 'antd'
import RevenueChartWrapper from './RevenueChartWrapper'
import InventoryChart from './InventoryChart'
import { useContainerReady } from '../../hooks/useContainerReady'

const MainCharts = () => {
    const pieCardRef = useRef(null);
    const isPieCardReady = useContainerReady(pieCardRef);

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
                    <RevenueChartWrapper 
                        chartHeight={chartHeight}
                    />
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
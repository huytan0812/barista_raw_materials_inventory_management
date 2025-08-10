import React from 'react'
import { Line } from '@ant-design/charts';

const RevenueChart = ({ chartHeight }) => {
    const revenueData = [
        { date: '2025-08-01', value: 1200 },
        { date: '2025-08-02', value: 1400 },
        { date: '2025-08-03', value: 1000 },
        { date: '2025-08-04', value: 1800 },
        { date: '2025-08-05', value: 1500 },
    ];

    // revenue data is add to revenueConfig
    const revenueConfig = {
        data: revenueData,
        xField: 'date',
        yField: 'value',
        smooth: true,
        autoFit: true,
        height: chartHeight,
        padding: 'auto',
    };

    return (
        <Line {...revenueConfig} />
    )
}

export default RevenueChart
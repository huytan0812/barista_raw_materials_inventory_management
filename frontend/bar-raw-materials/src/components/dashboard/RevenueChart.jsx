import React from 'react'
import { Line } from '@ant-design/charts';

const RevenueChart = (props) => {
    const {
        chartHeight,
        revenueData,
        xField
    } = props;

    // revenue data is add to revenueConfig
    const revenueConfig = {
        data: revenueData,
        xField: xField,
        yField: 'revenue',
        smooth: true,
        autoFit: true,
        height: chartHeight,
        padding: 'auto',
        point: {
            shapeField: 'circle',
            sizeField: 1.5,
        },
        interaction: {
            tooltip: {
                marker: false,
            },
        },
        style: {
            lineWidth: 1.5,
        }
    };

    return (
        <Line {...revenueConfig} />
    )
}

export default RevenueChart
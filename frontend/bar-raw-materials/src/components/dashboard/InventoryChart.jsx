import React from 'react'
import {Pie} from '@ant-design/charts';

const InventoryChart = ({chartHeight}) => {
    const inventoryData = [
        { type: 'Product A', value: 40 },
        { type: 'Product B', value: 21 },
        { type: 'Product C', value: 17 },
        { type: 'Product D', value: 22 },
    ];

    const inventoryConfig = {
        appendPadding: 10,
        data: inventoryData,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        autoFit: true,
        height: chartHeight,
        label: {
            text: 'value',
            style: { fontSize: '1.2rem', textAlign: 'center' },
        },
    };

    return (
        <Pie {...inventoryConfig} />
    )
}

export default InventoryChart
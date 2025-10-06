import React, {useState, useEffect, useRef} from 'react'
import { Line } from '@ant-design/charts';
import {useAuthContext} from '../../contexts/AuthContext'
import salesItemHTTP from '../../services/SalesOrderItemService'

const RevenueChart = (props) => {
    const {
        chartHeight,
        days
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const fetchRevenue = async() => {
            try {
                const response = await salesItemHTTP.get('/getRevenueByDays', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        days: days
                    }
                });
                if (response.status === 200) {
                    setRevenueData(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchRevenue();
    }, [days]);

    // const revenueData = [
    //     { date: '2025-08-01', value: 1200 },
    //     { date: '2025-08-02', value: 1400 },
    //     { date: '2025-08-03', value: 1000 },
    //     { date: '2025-08-04', value: 1800 },
    //     { date: '2025-08-05', value: 1500 },
    // ];

    // revenue data is add to revenueConfig
    const revenueConfig = {
        data: revenueData,
        xField: 'daily',
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
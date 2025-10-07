import React, {useState, useEffect, useRef} from 'react'
import {Card, Select } from 'antd'
import RevenueChart from './RevenueChart'
import { useContainerReady } from '../../hooks/useContainerReady'
import {useAuthContext} from '../../contexts/AuthContext'
import salesItemHTTP from '../../services/SalesOrderItemService'

const {Option} = Select;

const RevenueChartWrapper = ({chartHeight}) => {
    const lineCardRef = useRef(null);
    const isLineCardReady = useContainerReady(lineCardRef);
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    // state for handling filter
    const [filter, setFilter] = useState('day');

    // state for handling revenueData
    const [revenueData, setRevenueData] = useState([]);
    const [xField, setXField] = useState("daily");

    // state for handling filter by day
    const [displayDaySelect, setDisplayDaySelect] = useState(false);

    // state for handling filter by month
    const [displayMonthSelect, setDisplayMonthSelect] = useState(false);

    // side effect for fetching revenueData by default
    useEffect(() => {
        const fetchRevenueData = async() => {
            try {
                const response = await salesItemHTTP.get('getRevenue', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    },
                    params: {
                        type: 'days',
                        value: 7
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
        fetchRevenueData();
    }, []);

    // side effect for handling filter change
    useEffect(() => {
        if (filter === 'day') {
            setDisplayDaySelect(true);
            setDisplayMonthSelect(false);
            fetchRevenueByDays(7);
        }
        if (filter === 'month') {
            setDisplayMonthSelect(true);
            setDisplayDaySelect(false);
            fetchRevenueByMonths(3);
        }
    }, [filter]);

    const fetchRevenueByDays = async(value) => {
        // set revenueData and xField
        try {
            const response = await salesItemHTTP.get('getRevenue', {
                headers: {
                    Authorization: `Bearer ${persistToken.current}`
                },
                params: {
                    type: 'days',
                    value: value
                }
            });
            if (response.status === 200) {
                setRevenueData(response.data);
                setXField('daily');
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const fetchRevenueByMonths = async(value) => {
        try {
            const response = await salesItemHTTP.get('getRevenue', {
                headers: {
                    Authorization: `Bearer ${persistToken.current}`
                },
                params: {
                    type: 'months',
                    value: value
                }
            });
            if (response.status === 200) {
                setRevenueData(response.data);
                setXField('monthly');
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    return (
        <Card
            title="Doanh thu"
            extra={
                <React.Fragment>
                    <Select defaultValue={filter} onChange={setFilter} style={{ width: '12rem' }}>
                        <Option value="day">Ngày</Option>
                        <Option value="month">Tháng</Option>
                    </Select>
                    {
                        displayDaySelect
                        &&
                        <Select
                            defaultValue={7}
                            onChange={(value) => fetchRevenueByDays(value)}
                            style={{
                                width: '12rem',
                                marginLeft: '0.8rem',
                            }}
                        >
                            <Option value={7}>7 ngày</Option>
                            <Option value={14}>14 ngày</Option>
                            <Option value={28}>28 ngày</Option>
                        </Select>
                    }
                    {
                        displayMonthSelect
                        &&
                        <Select
                            defaultValue={3}
                            onChange={(value) => fetchRevenueByMonths(value)}
                            style={{
                                width: '12rem',
                                marginLeft: '0.8rem',
                            }}
                        >
                            <Option value={3}>3 tháng</Option>
                            <Option value={6}>6 tháng</Option>
                        </Select>
                    }
                </React.Fragment>
            }
            ref={lineCardRef}
        >
            {isLineCardReady && 
            <RevenueChart 
                chartHeight={chartHeight}
                revenueData={revenueData}
                xField={xField}
            />}
        </Card>
    )
}

export default RevenueChartWrapper
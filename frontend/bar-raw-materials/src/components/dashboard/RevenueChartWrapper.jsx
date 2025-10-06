import React, {useState, useEffect, useRef} from 'react'
import {Card, Select, DatePicker} from 'antd'
import RevenueChart from './RevenueChart'
import { useContainerReady } from '../../hooks/useContainerReady';

const {Option} = Select;
const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const RevenueChartWrapper = ({chartHeight}) => {
    const lineCardRef = useRef(null);
    const isLineCardReady = useContainerReady(lineCardRef);
    // state for handling filter
    const [filter, setFilter] = useState('day');

    // states for handling filter by day
    const [recentDays, setRecentDays] = useState(7);
    const [displayDaySelect, setDisplayDaySelect] = useState(false);

    // states for handling filter by month
    const [recentMonths, setRecentMonths] = useState(5);
    const [displayMonthSelect, setDisplayMonthSelect] = useState(false);

    // side effect for handling filter change
    useEffect(() => {
        if (filter === 'day') {
            setDisplayDaySelect(true);
            setDisplayMonthSelect(false);
        }
        if (filter === 'month') {
            setDisplayMonthSelect(true);
            setDisplayDaySelect(false);
        }
        if (filter === 'year') {
            setDisplayDaySelect(false);
            setDisplayMonthSelect(false);
        }
    }, [filter])

    return (
        <Card
            title="Doanh thu"
            extra={
                <React.Fragment>
                    <Select defaultValue={filter} onChange={setFilter} style={{ width: '12rem' }}>
                        <Option value="day">Ngày</Option>
                        <Option value="month">Tháng</Option>
                        <Option value="year">Năm</Option>
                    </Select>
                    {
                        displayDaySelect
                        &&
                        <Select
                            defaultValue={recentDays}
                            onChange={(value) => setRecentDays(value)}
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
                        <DatePicker 
                            onChange={onChange} 
                            picker="month"
                            style={{
                                width: '12rem',
                                marginLeft: '0.8rem',
                            }}
                        />
                    }
                </React.Fragment>
            }
            ref={lineCardRef}
        >
            {isLineCardReady && 
            <RevenueChart 
                chartHeight={chartHeight}
                days={recentDays}
            />}
        </Card>
    )
}

export default RevenueChartWrapper
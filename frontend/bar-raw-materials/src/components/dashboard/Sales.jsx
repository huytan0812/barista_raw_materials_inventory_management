import React, {useState} from 'react'
import StatsCard from './StatsCard'
import {Card, Select} from 'antd'

// destructuring Option component from Select
const {Option} = Select;

const Sales = () => {
  // set initial value for filter state is 'day'
  const [filter, setFilter] = useState('day');

  return (
    <div id="sales" style={{ marginTop: '1.6rem' }}>
      <Card
        title={`Tổng quan bán hàng theo ${filter}`}
        extra = {
          <Select defaultValue={filter} onChange={setFilter} style={{width: '12rem'}}>
            <Option value="day">Ngày</Option>
            <Option value="month">Tháng</Option>
            <Option value="quarter">Quý</Option>
            <Option value="year">Năm</Option>
          </Select>
        }
      >
        <StatsCard />
      </Card>
    </div>
  )
}

export default Sales
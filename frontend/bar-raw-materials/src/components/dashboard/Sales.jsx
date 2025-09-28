import React, {useState, useEffect, useRef} from 'react'
import StatsCard from './StatsCard'
import {Card, DatePicker, Button, Flex, Form} from 'antd'
import {ArrowRightOutlined, CalendarOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useAuthContext } from '../../contexts/AuthContext'
import salesItemHTTP from '../../services/SalesOrderItemService'

const {RangePicker} = DatePicker;

const dateFormat = "DD/MM/YYYY";

const Sales = () => {
  const {token} = useAuthContext();
  const persistToken = useRef(token);
  const [filterDateForm] = Form.useForm();
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [statsCard, setStatsCard] = useState({});

  const onDatesChange = (values) => {
    setDates(values);
  }

  useEffect(() => {
    const initFilter = async() => {
      try {
        const values = {};
        values.startDate = dates?.[0].format("YYYY-MM-DD");
        values.endDate = dates?.[1].format("YYYY-MM-DD");
        const response = await salesItemHTTP.post('filterRevenue', values, {
          headers: {
            Authorization: `Bearer ${persistToken.current}`
          }
        });
        if (response.status === 200) {
          console.log(response.data);
          setStatsCard(response.data);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    initFilter();
  }, [])

  const handleFilterDate = (values) => {
    const filterDate = async() => {
      try {
        values.startDate = dates?.[0].format("YYYY-MM-DD");
        values.endDate = dates?.[1].format("YYYY-MM-DD");
        const response = await salesItemHTTP.post('filterRevenue', values, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          console.log(response.data);
          setStatsCard({...response.data});
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    filterDate();
  }

  return (
    <div id="sales" style={{ marginTop: '1.6rem' }}>
      <Card
        title={`Tổng quan bán hàng từ ngày ${dates?.[0]?.format(dateFormat)} đến ngày ${dates?.[1]?.format(dateFormat)}`}
        extra = {
          <Form
            form={filterDateForm}
            name="filter_date"
            onFinish={handleFilterDate}
            layout='inline'
          >
            <Form.Item
              name="dateRange"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu và ngày kết thúc" },
              ]}
            >
              <RangePicker
                format={dateFormat}
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                size="middle"
                className="custom-range-picker"
                separator={<ArrowRightOutlined style={{ fontSize: "1.4rem" }} />}
                suffixIcon={<CalendarOutlined style={{ fontSize: "1.4rem" }} />}
                onChange={onDatesChange}
              />
            </Form.Item>
            <Form.Item
              label={null}
            >
              <Button htmlType="submit" color='default' variant='outlined'>Lọc</Button>
            </Form.Item>
          </Form>
        }
      >
        <StatsCard 
          statsCard={statsCard}
        />
      </Card>
    </div>
  )
}

export default Sales
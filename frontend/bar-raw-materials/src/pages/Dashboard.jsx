import React, { useState, useEffect } from 'react';
import { Breadcrumb, Card, Row, Col, Select, List, Avatar } from 'antd';
import { DollarCircleOutlined, RiseOutlined, ShoppingCartOutlined, UserAddOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';

const { Option } = Select;

const Dashboard = () => {
  const [filter, setFilter] = useState('month');
  const [chartHeight, setChartHeight] = useState(Math.max(window.innerHeight * 0.35, 250)); // min 250px

  // Update chart height on window resize
  useEffect(() => {
    const handleResize = () => {
      setChartHeight(Math.max(window.innerHeight * 0.35, 250));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = [
    { title: 'Revenue', value: '$12,340', icon: <DollarCircleOutlined style={{ fontSize: 30, color: '#3f8600' }} />, color: '#f6ffed' },
    { title: 'Profit', value: '$4,560', icon: <RiseOutlined style={{ fontSize: 30, color: '#cf1322' }} />, color: '#fff1f0' },
    { title: 'Sales Orders', value: '1,230', icon: <ShoppingCartOutlined style={{ fontSize: 30, color: '#096dd9' }} />, color: '#e6f7ff' },
    { title: 'New Customers', value: '320', icon: <UserAddOutlined style={{ fontSize: 30, color: '#531dab' }} />, color: '#f9f0ff' },
  ];

  const revenueData = [
    { date: '2025-08-01', value: 1200 },
    { date: '2025-08-02', value: 1400 },
    { date: '2025-08-03', value: 1000 },
    { date: '2025-08-04', value: 1800 },
    { date: '2025-08-05', value: 1500 },
  ];

  const inventoryData = [
    { type: 'Product A', value: 40 },
    { type: 'Product B', value: 21 },
    { type: 'Product C', value: 17 },
    { type: 'Product D', value: 22 },
  ];

  const products = [
    { name: 'Product A', qty: 500 },
    { name: 'Product B', qty: 350 },
    { name: 'Product C', qty: 300 },
    { name: 'Product D', qty: 250 },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    autoFit: true,
    height: chartHeight,
    padding: 'auto',
  };

  const inventoryConfig = {
    appendPadding: 10,
    data: inventoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    autoFit: true,
    height: chartHeight,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}%',
      style: { fontSize: 14, textAlign: 'center' },
    },
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {stats.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card style={{ backgroundColor: item.color }} bordered={false}>
              <Row align="middle" gutter={16}>
                <Col>{item.icon}</Col>
                <Col>
                  <h3>{item.title}</h3>
                  <p style={{ fontSize: 18, fontWeight: 'bold' }}>{item.value}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Section */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={16}>
          <Card
            title="Revenue"
            extra={
              <Select defaultValue={filter} onChange={setFilter} style={{ width: 120 }}>
                <Option value="day">Day</Option>
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
                <Option value="year">Year</Option>
              </Select>
            }
          >
            <Line {...revenueConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Inventory Proportion">
            <Pie {...inventoryConfig} />
          </Card>
        </Col>
      </Row>

      {/* Products Section */}
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card title="Top Seller Products">
            <List
              dataSource={products}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta avatar={<Avatar>{item.name.charAt(0)}</Avatar>} title={item.name} />
                  <div>{item.qty}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Slow Seller Products">
            <List
              dataSource={[...products].reverse()}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta avatar={<Avatar>{item.name.charAt(0)}</Avatar>} title={item.name} />
                  <div>{item.qty}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Low Quantity Products">
            <List
              dataSource={products.filter((p) => p.qty < 300)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta avatar={<Avatar>{item.name.charAt(0)}</Avatar>} title={item.name} />
                  <div>{item.qty}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

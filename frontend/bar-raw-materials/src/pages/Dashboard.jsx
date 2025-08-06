import { Row, Col } from 'antd';
import StatsCard from '../components/dashboard/StatsCard';
import RecentOrdersTable from '../components/dashboard/RecentsOrderTable';
import InventoryChart from '../components/dashboard/InventoryChart';

export default function Dashboard() {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <StatsCard title="Total Orders" value="120" />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard title="Total Materials" value="35" />
        </Col>
        <Col xs={24} sm={8}>
          <StatsCard title="Stock Alerts" value="4" />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} sm={12}>
          <InventoryChart />
        </Col>
        <Col xs={24} sm={12}>
          <RecentOrdersTable />
        </Col>
      </Row>
    </>
  );
}

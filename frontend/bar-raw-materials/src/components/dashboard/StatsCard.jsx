import { Card } from 'antd';

export default function StatsCard({ title, value }) {
  return (
    <Card style={{ textAlign: 'center' }}>
      <h3>{title}</h3>
      <p style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</p>
    </Card>
  );
}
// This component displays a card with a title and a value, typically used for statistics in the dashboard.
// It uses Ant Design's Card component for styling and layout.
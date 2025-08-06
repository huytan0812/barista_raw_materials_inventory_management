import { Table } from 'antd';

const columns = [
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
  { title: 'Material', dataIndex: 'material', key: 'material' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
];

const data = [
  { key: 1, orderId: 'ORD001', material: 'Beer Keg', quantity: 10 },
  { key: 2, orderId: 'ORD002', material: 'Whiskey Bottle', quantity: 5 },
];

export default function RecentOrdersTable() {
  return <Table columns={columns} dataSource={data} pagination={false} />;
}

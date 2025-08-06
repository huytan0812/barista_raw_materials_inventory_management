import { Card } from 'antd';
import { Pie } from '@ant-design/charts';

export default function InventoryChart() {
  const data = [
    { type: 'Beer', value: 40 },
    { type: 'Whiskey', value: 21 },
    { type: 'Vodka', value: 17 },
    { type: 'Rum', value: 22 },
  ];

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: { type: 'outer', content: '{name} {percentage}' },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <Card>
      <h3>Inventory Composition</h3>
      <Pie {...config} />
    </Card>
  );
}

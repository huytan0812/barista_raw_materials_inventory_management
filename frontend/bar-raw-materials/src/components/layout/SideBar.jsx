import { Layout, Menu } from 'antd';
import { PieChartOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Sider } = Layout;

export default function Sidebar() {
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="logo" style={{ color: '#fff', padding: 16, fontSize: 18 }}>
        Bar Inventory
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<DatabaseOutlined />}>
          Raw Materials
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

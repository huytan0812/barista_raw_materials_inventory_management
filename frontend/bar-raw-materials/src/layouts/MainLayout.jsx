import { Layout } from 'antd';
import Sidebar from '../components/layout/SideBar';
import HeaderBar from '../components/layout/HeaderBar';
import './layout.css';

const { Content } = Layout;

export default function AppLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: '24px', background: '#f0f2f5' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

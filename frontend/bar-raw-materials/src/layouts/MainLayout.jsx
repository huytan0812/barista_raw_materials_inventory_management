import { Layout } from 'antd';
import { LayoutProvider } from '../contexts/LayoutContext';

import Content from '../components/layout/Content';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sider from '../components/layout/Sider';

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <LayoutProvider>
        <Sider />
        <Layout>
          <Header />
          <Content />
          <Footer />
        </Layout>
      </LayoutProvider>
    </Layout>
  );
}

export default MainLayout;
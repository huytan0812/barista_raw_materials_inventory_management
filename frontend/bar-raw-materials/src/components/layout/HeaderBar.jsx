import { Layout } from 'antd';

const { Header } = Layout;

export default function HeaderBar() {
  return (
    <Header
      style={{
        background: '#fff',
        padding: 0,
        textAlign: 'right',
        paddingRight: 20,
      }}
    >
      Welcome, Admin
    </Header>
  );
}

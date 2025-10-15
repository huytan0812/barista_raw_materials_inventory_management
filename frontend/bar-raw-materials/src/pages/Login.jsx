import React from 'react'
import { Button, Flex, Form, Input, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext.jsx';
import { useMessageContext } from '../contexts/MessageContext.jsx';

const Login = () => {
  const { login } = useAuthContext();
  const { message } = useMessageContext();
  let navigate = useNavigate();

  const handleSubmit = async (fields) => {
    const username = fields.username;
    const password = fields.password;

    await login(username, password);

    // if login success, redirect to home page
    navigate('/');
  }

  return (
    <React.Fragment>
      <Tag color="green">{message}</Tag>
      <Flex 
        justify='center' 
        style={{
          height: '100vh', 
          alignItems: 'center' 
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ 
            maxWidth: 600,
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            padding: '1.6rem'
          }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={ handleSubmit }
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Nhập tên tài khoản' }]}
          >
              <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu' }]}
          >
              <Input.Password />
          </Form.Item>

          <Form.Item label={null} style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">
                <span style={{ fontSize: '1.4rem' }}>Đăng nhập</span>
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </React.Fragment>
  )
}

export default Login
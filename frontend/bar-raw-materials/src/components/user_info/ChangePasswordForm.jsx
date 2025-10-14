import React from 'react'
import {Form, Input} from 'antd'
import {useAuthContext} from '../../contexts/AuthContext'
import userHTTP from '../../services/UserService'

const ChangePasswordForm = (props) => {
    const {
      userId,
      form,
      onChangeFailure,
      onChangeSuccess,
    } = props;
    const {token} = useAuthContext();

    const handleSubmit = (values) => {
      const submit = async() => {
        try {
          const response = await userHTTP.post(`resetPassword/${userId}`, values, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            onChangeSuccess();
          }
        }
        catch (error) {
          onChangeFailure();
          const responseErr = error.response;
          if (responseErr?.data?.confirmPasswordDifferent) {
            form.setFields([
              {
                name: 'confirmPassword',
                errors: [responseErr.data.confirmPasswordDifferent]
              }
            ]);
          }
        }
      }
      submit();
    };

    return (
        <Form
            form={form}
            name="reset_password"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={handleSubmit}
        >
            <Form.Item
              label="Mật khẩu mới"
              name="password"
              rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
              label="Nhắc lại mật khẩu"
              name="confirmPassword"
              rules={[{ required: true, message: 'Nhắc lại mật khẩu' }]}
            >
                <Input.Password />
            </Form.Item>
        </Form>
    )
}

export default ChangePasswordForm
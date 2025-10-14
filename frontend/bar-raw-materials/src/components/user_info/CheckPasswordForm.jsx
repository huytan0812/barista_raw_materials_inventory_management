import React from 'react'
import {Form, Input, Button, Flex} from 'antd'
import {useAuthContext} from '../../contexts/AuthContext'
import userHTTP from '../../services/UserService'

const CheckPasswordForm = (props) => {
    const {
        userId,
        setCheckedPassword,
        popUpMsg
    } = props;
    const {token} = useAuthContext();
    const [checkPasswordForm] = Form.useForm();

    const handleSubmit = (values) => {
        const submit = async() => {
            console.log(values);
            try {
                const response = await userHTTP.post(`checkPassword/${userId}`, values,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    setCheckedPassword(true);
                }
            }
            catch (error) {
                const responserErr = error.response;
                popUpMsg('error', responserErr?.data);
                checkPasswordForm.setFields([
                    {
                        name: 'password',
                        errors: [responserErr?.data]
                    }
                ])
            }
        }
        submit();
    };

    return (
        <Form
            form={checkPasswordForm}
            name="check_password"
            wrapperCol={{ span: 24 }}
            autoComplete="off"
            onFinish={handleSubmit}
        >
            <Flex
                gap={8}
                justify='center'
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    labelCol={6}
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button 
                        color="primary"
                        variant="solid"
                        htmlType="submit"
                    >
                        Xác nhận
                    </Button>
                </Form.Item>
            </Flex>
        </Form>
    )
}

export default CheckPasswordForm
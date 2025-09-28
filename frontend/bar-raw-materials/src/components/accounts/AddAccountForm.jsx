import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Select, Radio} from 'antd'
import {useAuthContext} from '../../contexts/AuthContext'
import userHTTP from '../../services/UserService'

const {Option} = Select;

const AddAccountForm = (props) => {
    const {
        form,
        formName,
        popUpMsg,
        setRefreshUsers,
        handleAddUserSuccess
    } = props;
    const [gender, setGender] = useState(1);
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [roles, setRoles] = useState([]);

    const handleSubmit = (values) => {
        const sumbit = async() => {
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(values)], {type: 'application/json'}));
            try {
                const response = await userHTTP.post('/add', formData, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`,
                        'Content-Type': "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    popUpMsg('success', "Thêm tài khoản thành công");
                    form.resetFields();
                    setRefreshUsers(prev=>!prev);
                    handleAddUserSuccess();
                } 
            }
            catch (error) {
                const responseErr = error.response;
                console.log(responseErr);
                if (responseErr.data?.confirmPasswordDifferent) {
                    form.setFields(
                    [
                        {
                            name: 'confirmPassword',
                            errors: [responseErr.data?.confirmPasswordDifferent],
                        },
                    ]);
                }
                if (responseErr.data?.duplicatedUserEmail) {
                    form.setFields(
                    [
                        {
                            name: 'email',
                            errors: [responseErr.data.duplicatedUserEmail],
                        },
                    ]);
                }
                if (responseErr.data?.duplicatedUserPhoneNumber) {
                    form.setFields(
                    [
                        {
                            name: 'phoneNumber',
                            errors: [responseErr.data.duplicatedUserPhoneNumber],
                        },
                    ]);
                }
                popUpMsg('error', "Thêm tài khoản thất bại");
            }
        }
        sumbit();
    }

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setGender(e.target.value);
    };

    // side effect for fetching roles
    useEffect(() => {
        const fetchRoles = async() => {
            try {
                const response = await userHTTP.get("allRole", {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setRoles(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchRoles();
    }, []);

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={handleSubmit}
        >
            <Form.Item
                label="Tên tài khoản"
                labelAlign='left'
                name="username"
                rules={[{ required: true, message: 'Tên tài khoản không được để trống' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Nhập mật khẩu' }]}
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
            <Form.Item
                label="Tên đệm"
                labelAlign='left'
                name="firstName"
                rules={[{ required: true, message: 'Tên đệm không được để trống' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Tên"
                labelAlign='left'
                name="lastName"
                rules={[{ required: true, message: 'Tên không được để trống' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                labelAlign='left'
                name="email"
                rules={[{ required: true, message: 'Email không được để trống' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Số điện thoại"
                labelAlign='left'
                name="phoneNumber"
                rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Vai trò"
                labelAlign="left"
                name="roleId"
                rules={[{required: true, message: 'Vai trò không được để trống'}]}
            >
                <Select placeholder="Chọn vai trò">
                    {roles.map(role => (
                    <Option key={role.id} value={role.id}>{role.role}</Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Giới tính"
                labelAlign='left'
                name="gender"
                rules={[{required: true, message: 'Giới tính không được để trống'}]}
            >
                <Radio.Group onChange={onChange} value={gender}>
                    <Radio value={0}>Nam</Radio>
                    <Radio value={1}>Nữ</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    )
}

export default AddAccountForm
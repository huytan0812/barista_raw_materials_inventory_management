import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Select, Radio} from 'antd'
import {useAuthContext} from '../../contexts/AuthContext'
import userHTTP from '../../services/UserService'

const {Option} = Select;

const EditUserForm = (props) => {
    const {
        form,
        formName,
        user,
        onEditFailure,
        onEditSuccess
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [roles, setRoles] = useState([]);
    const [gender, setGender] = useState(1);

    const handleSubmit = (values) => {
        const submit = async() => {
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(values)], {type: 'application/json'}));
            try {
                const response = await userHTTP.post(`update/${user?.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`,
                        'Content-Type': "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    onEditSuccess();
                }
            }
            catch (error) {
                const responseErr = error.response;
                if (responseErr?.data?.duplicatedUsername) {
                    form.setFields([
                        {
                            name: 'username',
                            errors: [responseErr.data.duplicatedUsername]
                        }
                    ]);
                }
                if (responseErr?.data?.duplicatedUserEmail) {
                    form.setFields([
                        {
                            name: 'email',
                            errors: [responseErr.data.duplicatedUserEmail]
                        }
                    ])
                };
                if (responseErr?.data?.duplicatedUserPhoneNumber) {
                    form.setFields([
                        {
                            name: 'phoneNumber',
                            errors: [responseErr.data.duplicatedUserPhoneNumber]
                        }
                    ])
                };
                onEditFailure();
            }
        }
        submit();
    }

    const onChange = (e) => {
        setGender(e.target.value);
    }

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

    // side effect for populating account info
    useEffect(() => {
        form.setFieldsValue({
            'id': user?.id,
            'username': user?.username,
            'firstName': user?.firstName,
            'lastName': user?.lastName,
            'email': user?.email,
            'phoneNumber': user?.phoneNumber,
            'roleId': user?.roleId,
            'gender': user?.gender ? 1 : 0,
            'isActive': user?.isActive
        });
    }, [form, user]);

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
                hidden={true}
                name="id"
                value={user?.id}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Tên tài khoản"
                labelAlign='left'
                name="username"
                rules={[{ required: true, message: 'Tên tài khoản không được để trống' }]}
            >
                <Input />
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
                label="Trạng thái"
                labelAlign='left'
                name="isActive"
                rules={[{required: true, message: 'Trạng thái không được để trống'}]}
            >
                <Radio.Group onChange={onChange} value={gender}>
                    <Radio value={true}>Kích hoạt</Radio>
                    <Radio value={false}>Hủy kích hoạt</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label="Giới tính"
                labelAlign='left'
                name="gender"
                rules={[{required: true, message: 'Giới tính không được để trống'}]}
            >
                <Radio.Group onChange={onChange} value={gender}>
                    <Radio value={1}>Nam</Radio>
                    <Radio value={0}>Nữ</Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    )
}

export default EditUserForm
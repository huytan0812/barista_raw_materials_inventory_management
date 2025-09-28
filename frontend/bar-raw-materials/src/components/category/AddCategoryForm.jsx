import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Select, Radio} from 'antd'
import {useAuthContext} from '../../contexts/AuthContext'
import categoryHTTP from '../../services/CategoryService'

const {Option} = Select;

const AddCategoryForm = (props) => {
    const {
        form,
        formName,
        popUpMsg,
        setRefreshCtgs,
        handleAddCtgSuccess
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [ctgs, setCtgs] = useState([]);

    const handleSubmit = (values) => {
        const sumbit = async() => {
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(values)], {type: 'application/json'}));
            try {
                const response = await categoryHTTP.post('/add', formData, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`,
                        'Content-Type': "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    popUpMsg('success', "Thêm danh mục thành công");
                    form.resetFields();
                    setRefreshCtgs(prev=>!prev);
                    handleAddCtgSuccess();
                } 
            }
            catch (error) {
                const responseErr = error.response;
                console.log(responseErr);
                popUpMsg('error', "Thêm danh mục thất bại");
            }
        }
        sumbit();
    }

    // side effect for fetching categories
    useEffect(() => {
        const fetchCategories = async() => {
            try {
                const response = await categoryHTTP.get("allLight", {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setCtgs(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchCategories();
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
                label="Tên danh mục"
                labelAlign='left'
                name="name"
                rules={[{ required: true, message: 'Tên danh mục không được để trống' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Mô tả"
                labelAlign='left'
                name="description"
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Danh mục cha"
                labelAlign="left"
                name="parentId"
            >
                <Select placeholder="Chọn danh mục cha">
                    {ctgs.map(ctg => (
                    <Option key={ctg.id} value={ctg.id}>{ctg.name}</Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    )
}

export default AddCategoryForm
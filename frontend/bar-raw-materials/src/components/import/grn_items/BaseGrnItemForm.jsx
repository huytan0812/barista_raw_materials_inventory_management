import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Select, DatePicker, InputNumber, AutoComplete} from 'antd'
import dayjs from "dayjs"
import productHTTP from '../../../services/ProductService'
import batchHTTP from '../../../services/BatchService'
import { useAuthContext } from '../../../contexts/AuthContext'

const {Option} = Select;

const BaseGrnItemForm = (props) => {
    const {
        form,
        formName,
        handleSubmit,
        onDateChange,
        mode,
        grnId,
        grnItem 
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);

    // states for fetching products and batches
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [product, setProduct] = useState([]);
    const [batchList, setBatchList] = useState([]);

    const handleLotChange = (value) => {
        const batch = batchList.find((b) => b.lotNumber === value);
        if (batch) {
            // if batch already exists
            setSelectedBatch(batch);
            form.setFieldsValue({
                productId: batch.productId,
                mfgDate: dayjs(batch.mfgDate),
                expDate: dayjs(batch.expDate),
            });
        } 
        else {
            // Nếu batch mới
            setSelectedBatch(null);
            form.setFieldsValue({
                productId: undefined,
                mfgDate: undefined,
                expDate: undefined,
            });
        }
    };

    // side effect for fetching all products
    useEffect(() => {
        const fetchProducts = async() => {
            try {
                const response = await productHTTP.get('/allLight', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                   setProduct(response.data);
                }
            }
            catch(error) {
                console.log(error);
            }
        }
        fetchProducts();
    }, [])

    // side effect for fetching batch list
    useEffect(() => {
        const fetchBatches = async() => {
            try {
                const response = await batchHTTP.get('/allLight', {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    setBatchList(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }   
        fetchBatches();
    }, []);

    // side effect for pre-populating data for update form
    useEffect(() => {
        if (mode === "update" && grnItem && batchList.length > 0) {
            form.setFieldsValue({
                'id': grnItem?.id,
                'lotNumber': grnItem?.lotNumber,
                'quantityImport': grnItem?.quantityImport,
                'unitCost': grnItem?.unitCost,
                'vatRate': grnItem?.vatRate ? grnItem.vatRate * 100 : null,
            });
            handleLotChange(grnItem.lotNumber);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, grnItem, mode, batchList]);

    return (
        <Form
            size="middle"
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            encType='multipart/form-data'
            onFinish={handleSubmit}
        >
            {mode==="update" && 
            <Form.Item label="Hidden Field" name="id" hidden={true}>
                <Input />
            </Form.Item>
            }
            <Form.Item 
                label="Hidden Field" 
                name="grnId" 
                hidden={true}
                initialValue={grnId}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Mã số lô"
                name="lotNumber"
                rules={[{ required: true, message: "Mã số lô không được để trống" }]}
            >
                <AutoComplete
                    options={batchList.map((b) => 
                        ({ 
                            value: b.lotNumber,
                            label: `${b.lotNumber} / ${b.productName}`
                        })
                    )}
                    placeholder="Chọn hoặc nhập mã lô"
                    filterOption={(inputValue, option) =>
                        option?.label.toUpperCase().includes(inputValue.toUpperCase())
                    }
                    onSelect={handleLotChange}
                    onChange={handleLotChange} // cho phép nhập mới
                    allowClear={true}
                />
            </Form.Item>

            <Form.Item
                label="Sản phẩm"
                labelAlign='left'
                name="productId"
                rules={[{ required: true, message: "Sản phẩm không được để trống" }]}
            >
                {
                    selectedBatch ? 
                    (
                    <Select disabled>
                        {product.map((p) => (
                            <Option key={p.productId} value={p.productId}>
                                {p.name}
                            </Option>
                        ))}
                    </Select>
                    )
                    :
                    (
                    <Select 
                        placeholder="Chọn sản phẩm"
                        showSearch
                        optionFilterProp="children" // search against the option text
                        filterOption={(input, option) =>
                            option?.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {product.map((product) => (
                            <Option key={product.productId} value={product.productId}>{product.name}</Option>
                        ))}
                    </Select>
                    )
                }
            </Form.Item>

            <Form.Item
                label="Số lượng nhập"
                labelAlign="left"
                name="quantityImport"
                rules={[{ required: true, message: 'Số lượng nhập không được bỏ trống' }]}
                >
                <InputNumber
                    min={0}
                    style={{
                    float: 'right',
                    fontSize: '2.4rem',
                    width: '100%'
                    }}
                    size="middle"
                />
            </Form.Item>

            <Form.Item
                label="Đơn giá nhập"
                labelAlign="left"
                name="unitCost"
                rules={[{ required: true, message: 'Đơn giá nhập không được bỏ trống' }]}
                >
                <InputNumber
                    min={0}
                    style={{
                    float: 'right',
                    fontSize: '2.4rem',
                        width: '100%'
                    }}
                    size="middle"
                />
            </Form.Item>

            <Form.Item
                label="Ngày sản xuất"
                labelAlign='left'
                name="mfgDate"
                rules={[{ required: true, message: 'Ngày sản xuất đơn không được để trống' }]}
            >
                <DatePicker
                    format="DD/MM/YYYY"
                    size="middle" 
                    onChange={onDateChange} 
                    needConfirm
                    disabled={!!selectedBatch} 
                />
            </Form.Item>

            <Form.Item
                label="Hạn sử dụng"
                labelAlign='left'
                name="expDate"
                rules={[{ required: true, message: 'Hạn sử dụng không được để trống' }]}
            >
                <DatePicker
                    format="DD/MM/YYYY"
                    size="middle" 
                    onChange={onDateChange} 
                    needConfirm
                    disabled={!!selectedBatch} 
                />
            </Form.Item>

            <Form.Item
                label="VAT đầu vào (%)"
                labelCol={12}
                wrapperCol={24}
                labelAlign="left"
                name="vatRate"
                rules={[{ required: true, message: 'VAT đầu vào không được bỏ trống' }]}
                >
                <InputNumber
                    min={0}
                    style={{
                        float: 'right',
                        fontSize: '2.4rem',
                        width: '100%'
                    }}
                    size="middle"
                />
            </Form.Item>
        </Form>
  )
}

export default BaseGrnItemForm
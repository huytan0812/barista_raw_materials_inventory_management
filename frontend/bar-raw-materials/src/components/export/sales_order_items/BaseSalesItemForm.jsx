import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Select, InputNumber, Button, Table, Flex} from 'antd'
import { FileProtectOutlined } from '@ant-design/icons';
import {useAuthContext} from '../../../contexts/AuthContext'
import productHTTP from '../../../services/ProductService'
import grnItemHTTP from '../../../services/GoodsReceiptItemService'

const {Option} = Select

const dateFormat = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
}

const BaseSalesItemForm = (props) => {
    const {
        form,
        formName,
        handleSubmit
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token); 

    // states for fetching a list of product and selected product
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // states for fetching a list of Grn items based on selected product
    const [grnItems, setGrnItems] = useState([]);
    const [selectedGrnItems, setSelectedGrnItems] = useState([]);
    const [selectedGrnItem, setSelectedGrnItem] = useState(null);

    // side effect for fetching products
    useEffect(() => {
      const fetchProducts = async() => {
        try {
          const response = await productHTTP.get('/allLight', {
            headers: {
              Authorization: `Bearer ${persistToken.current}`
            }
          });
          if (response.status === 200) {
            setProducts(response.data);
          }
        }
        catch (error) {
          console.log(error);
        }
      }
      fetchProducts();
    }, []);

    // side effect for fetching list of grn items
    useEffect(() => {
      const fetchGrnItems = async() => {
        try {
          const response = await grnItemHTTP.get(`/allLight/${selectedProduct.productId}`, {
            headers: {
              Authorization: `Bearer ${persistToken.current}`
            }
          });
          if (response.status === 200) {
            setGrnItems(response.data);
          }
        }
        catch (error) {
          console.log(error);
        }
      }
      if (selectedProduct) {
        fetchGrnItems();
      }
    }, [selectedProduct]);

    const handleAddGrnItem = async () => {
      const values = form.getFieldsValue(["grnItemId", "quantityTake"]);
      if (!values.grnItemId || !values.quantityTake) return;

      const grnItem = grnItems.find((g) => g.id === values.grnItemId);

      // Build payload for backend
      const payload = {
        grnItemId: grnItem.id,
        productId: selectedProduct.id,
        quantityTake: values.quantityTake,
      };

      try {
      // 🔹 Placeholder: submit to server
      // Replace this with your API call
      // Example: await axios.post("/api/export-items", payload);
      console.log("Submitting to server:", payload);

      // If success, update local UI
      const existsIndex = selectedGrnItems.findIndex(
        (item) => item.id === grnItem.id
      );

      let newList;
      if (existsIndex >= 0) {
        newList = [...selectedGrnItems];
        newList[existsIndex].quantityTake = values.quantityTake;
      } else {
        newList = [
          ...selectedGrnItems,
          { ...grnItem, quantityTake: values.quantityTake },
        ];
      }
      setSelectedGrnItems(newList);

      // Reset child fields
      form.setFieldsValue({ grnItemId: undefined, quantityTake: undefined });
      setSelectedGrnItem(null);

      } catch (error) {
        // 🔹 Placeholder error handling
        console.error("Error submitting export item:", error);
        // You can show notification here
      }
    };

    const columns = [
      { title: "Mã lô",
        dataIndex: "lotNumber",
        key: "lotNumber",
        align: "center"
      },
      {
        title: "HSD",
        dataIndex: "expDate",
        key: "expDate",
        render: (d) => new Intl.DateTimeFormat("vi-VN", dateFormat).format(new Date(d)),
        align: "right",
        titleAlign: "center"
      },
      { title: "SL lấy ra", 
        dataIndex: "quantityTake", 
        key: "quantityTake",
        align: "right",
        titleAlign: "center"
      },
      {
        title: "Đơn giá nhập",
        dataIndex: "unitCost",
        key: "unitCost",
        render: (value) => new Intl.NumberFormat("vn-VN", { style: 'currency', currency: 'VND' }).format(value),
        align: "right",
        titleAlign: "center"
      },
      {
        title: "Hành động",
        key: "action",
        render: (_,record) => {
            return (
                <Flex gap="1rem">
                  <Button 
                      color="blue" 
                      variant="solid" 
                      value={record.productId}
                  >
                      <span style={{fontSize: '1.4rem'}}>Sửa</span>
                  </Button>
                  <Button 
                      color="red" 
                      variant="solid"
                  >
                    <span value={record.productId} style={{fontSize: '1.4rem'}}>Xóa</span>
                  </Button>
                </Flex>
            )
          },
        align: "center"
      }
    ];

    return (
      <Form
        size="middle"
        form={form}
        name={formName}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Sản phẩm"
          labelAlign='left'
          name="productId"
          rules={[{ required: true, message: "Sản phẩm không được để trống" }]}
        >
            <Select 
              placeholder="Chọn sản phẩm"
              showSearch
              optionFilterProp="productName"  // search by product name
              filterOption={(input, option) =>
                  option?.productName?.toLowerCase().includes(input.toLowerCase())
              }
              allowClear
              onChange={(productId) => {
                const product = products.find((p) => p.productId === productId);
                setSelectedProduct(product);
                setSelectedGrnItem(null);
                setSelectedGrnItems([]); // reset when switching product
                form.resetFields(["grnItemId", "quantityTake"]);
              }}
            >
                {products?.map((product) => (
                  <Option 
                      key={product.productId} 
                      value={product.productId}
                      productName={product.name}
                  >
                    {product.name}
                  </Option>
                ))}
            </Select>
        </Form.Item>

        {/* 2. Select GRN item */}
        {selectedProduct && (
          <Form.Item
            label={`Lô hàng nhập kho`}
            labelAlign="left"
            name="grnItemId"
            rules={[{ required: true, message: "Lô hàng không được để trống" }]}
          >
            <Select
              placeholder="Chọn lô hàng"
              allowClear
              onChange={(grnItemId) => {
                const grnItem = grnItems.find((g) => g.id === grnItemId);
                setSelectedGrnItem(grnItem);
                form.setFieldsValue({ quantityTake: undefined });
              }}
            >
              {grnItems?.map((grnItem) => (
                <Option key={grnItem.id} value={grnItem.id}>
                  {grnItem.lotNumber}-{" HSD: "}{new Intl.DateTimeFormat("vi-VN", dateFormat).format(
                    new Date(grnItem.expDate)
                  )}-{` Giá nhập: ${grnItem.unitCost}`}             
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* 3. Quantity take */}
        {selectedGrnItem && (
          <React.Fragment>
            <p 
              style={{
                fontSize: '1.4rem',
                textAlign: 'center'
              }}
            >
              SLCL: {selectedGrnItem.quantityRemain}, đơn giá nhập: {selectedGrnItem.unitCost},
              HSD: {new Intl.DateTimeFormat("vi-VN", dateFormat).format(
                    new Date(selectedGrnItem.expDate)
                  )}
            </p>
            <Form.Item
              label="Số lượng lấy ra"
              labelAlign="left"
              name="quantityTake"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              rules={[
                { required: true, message: "Số lượng lấy ra không được để trống" },
              ]}
              style={{
                marginTop: '0.8rem'
              }}
            >
              <div
                style={{
                  display: 'flex'
                }}
              >
                <InputNumber
                  min={0}
                  style={{
                  float: 'right',
                  fontSize: '2.4rem',
                  width: '100%'
                  }}
                  size="middle"
                  onPressEnter={handleAddGrnItem}
                />
                <Button
                  color="primary" 
                  variant="outlined"
                  onClick={handleAddGrnItem}
                  style={{
                    marginLeft: '0.8rem'
                  }}
                >
                  <span style={{fontSize: '1.4rem'}}>
                    Thêm
                  </span>
                </Button>
              </div>
            </Form.Item>
          </React.Fragment>
        )}

        {/* 4. Display list of selected GRN items */}
        {selectedGrnItems.length > 0 && (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={selectedGrnItems}
            pagination={false}
            bordered
            size="small"
            style={{
              marginBottom: '0.8rem'
            }}
          />
        )}

        <Form.Item
          label="Số lượng xuất"
          labelAlign='left'
          name="quantitySold"
          rules={[{required: true, message: "Số lượng xuất không được để trống"}]}
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
          label="Đơn giá bán"
          labelAlign='left'
          name="unitPrice"
          rules={[{required: true, message: "Đơn giá bán không được để trống"}]}
          initialValue={selectedProduct ? selectedProduct.listPrice : null}
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
          label="Giảm giá (%)"
          labelAlign='left'
          name="discount"
          rules={[{required: true, message: "Giảm giá hàng bán không được để trống"}]}
          initialValue={0}
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
          label="VAT đầu ra (%)"
          labelAlign='left'
          name="vatRate"
          rules={[{required: true, message: "VAT đầu ra không được để trống"}]}
          initialValue={10}
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

export default BaseSalesItemForm
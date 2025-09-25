import React, {useState, useEffect, useRef} from 'react'
import {Form, Input, Modal, Select, InputNumber, Button, Table, Flex, message} from 'antd'
import {useAuthContext} from '../../../contexts/AuthContext'
import productHTTP from '../../../services/ProductService'
import grnItemHTTP from '../../../services/GoodsReceiptItemService'
import exportItemHTTP from '../../../services/ExportItemService'
import EditExpItemModal from '../exp_items/EditExpItemModal'

const {Option} = Select

const dateFormat = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
}

const BaseSalesItemForm = (props) => {
    const {
        salesItem,
        form,
        formName,
        handleSubmit,
        edit,
        expItems
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token); 

    // states for fetching a list of produc, selected product and selected GrnItem
    const [products, setProducts] = useState([]);
    // once chosen, never change
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [disableProduct, setDisableProduct] = useState(false);
    // will refresh after creating a new ExportItem successfully
    const [selectedGrnItem, setSelectedGrnItem] = useState(null);

    // states for fetching a list of Grn items based on selected product
    const [grnItems, setGrnItems] = useState([]);
    const [refreshGrnItems, setRefreshGrnItems] = useState(false);
    const [exportItems, setExportItems] = useState([]);

    // states for handling edit export item
    const [activeEditExpItem, setActiveEditExpItem] = useState(false);

    // state for handling message
    const [messageApi, contextHolder] = message.useMessage();

    const popUpMsg = (type, msg) => {
      messageApi.open({
        type: type,
        content: msg
      })
    }; 

    // side effect for editing Sales Order Item
    useEffect(() => {
      if (edit) {
        const product = products.find((p) => p.productId === salesItem.productId);
        setSelectedProduct(product);
        setDisableProduct(true);
        setExportItems(expItems);
        form.setFieldsValue({
          productId: salesItem.productId,
          quantitySold: salesItem.quantitySold,
          unitPrice: salesItem.unitPrice
        });
      }
    }, [edit, products, salesItem, expItems, form]);

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

    // side effect for fetching list of grn items based on selected product
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
    }, [selectedProduct, refreshGrnItems]);

    // used for fetching list of ExportItems
    const fetchExportItems = async() => {
      try {
        const response = await exportItemHTTP.get(`salesItem/${salesItem.id}/list`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          const data = response.data;
          let totalQuantityTake = 0;
          for (let exp in data) {
            totalQuantityTake += data[exp].quantityTake;
          }
          setExportItems(data);
          form.setFieldsValue({quantitySold: totalQuantityTake});
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    // event handlers for handling ExportItem
    // add
    const handleAddExportItem = async () => {
      const values = form.getFieldsValue(["grnItemId", "quantityTake"]);
      values.salesItemId = salesItem.id;
      try {
        // create ExportItemDetails
        const response = await exportItemHTTP.post('/add', values, {
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
          popUpMsg('success', "Thêm thành công");
          // update the list of ExportItems table
          fetchExportItems();
          // disabled product to lock in
          setDisableProduct(true);
          // reset selectedGrnItem and reset <Select> of Grn items
          setSelectedGrnItem(null);
          form.resetFields(['grnItemId']);
          // refresh the list of grn items by product
          setRefreshGrnItems(prev=>!prev);
        }
      }
      catch (error) {
        const responseErr = error.response;
        console.log(responseErr);
        popUpMsg('error', responseErr?.data);
      }
    };
    // edit
    const handleEditExportItem = (exportItemId) => {
      setActiveEditExpItem(parseInt(exportItemId));
    }
    const handleEditExportItemSuccess = (msg) => {
      popUpMsg('success', msg);
      // reset grn items
      setRefreshGrnItems(prev=>!prev);
      // reset table
      fetchExportItems();
    }
    const handleEditExportItemFailure = (msg) => {
      popUpMsg('error', msg);
    }
    // delete
    const handleDeleteExportItem = (exportItemId) => {
      const deleteExpItem = async() => {
        try {
          const response = await exportItemHTTP.get(`/delete/${exportItemId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            popUpMsg('success', response.data);
            // reset grn items
            setRefreshGrnItems(prev=>!prev);
            // reset table
            fetchExportItems();
          }
        }
        catch (error) {
          const responseErr = error.response;
          popUpMsg('error', responseErr?.data);
        }
      }
      deleteExpItem();
    }

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
                <Flex 
                  gap="1rem"
                  justify='center'
                >
                  <Button 
                      color="primary" 
                      variant="solid"
                      onClick={() => handleEditExportItem(record.id)}
                  >
                    <span value={record.id} style={{fontSize: '1.4rem'}}>Sửa</span>
                  </Button>
                  <EditExpItemModal 
                    isActive={activeEditExpItem === record.id}
                    resetActiveEditModal={() => setActiveEditExpItem(0)}
                    onEditSuccess={handleEditExportItemSuccess}
                    onEditFailure={handleEditExportItemFailure}
                    expItem={record}
                  />
                  <Button 
                      color="red" 
                      variant="solid"
                      onClick={() => handleDeleteExportItem(record.id)}
                  >
                    <span value={record.id} style={{fontSize: '1.4rem'}}>Xóa</span>
                  </Button>
                </Flex>
            )
          },
        align: "center"
      }
    ];

    return (
      <React.Fragment>
        {contextHolder}
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
            label={null} 
            name="salesItemId"
            hidden={true}
            initialValue={salesItem.id}
          >
            <Input
              disabled={true}
            />
          </Form.Item>
          <Form.Item
            shouldUpdate
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
                  setExportItems([]); // reset when switching product
                  // set unitPrice with product's listPrice
                  form.setFieldsValue({ unitPrice: product.listPrice });
                  form.resetFields(["grnItemId", "quantityTake"]);
                }}
                disabled={disableProduct}
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
            >
              <Select
                placeholder="Chọn lô hàng"
                allowClear
                onChange={(grnItemId) => {
                  const grnItem = grnItems.find((g) => g.id === grnItemId);
                  setSelectedGrnItem(grnItem);
                  form.setFieldsValue({ quantityTake: undefined });
                }}
                popupMatchSelectWidth={false}
              >
                {grnItems?.map((grnItem) => (
                  <Option key={grnItem.id} value={grnItem.id}>
                    {grnItem.lotNumber}-{"HSD: "}{new Intl.DateTimeFormat("vi-VN", dateFormat).format(
                      new Date(grnItem.expDate)
                    )}-{`Giá nhập: ${grnItem.unitCost}`}-{`SLCL: ${grnItem.quantityRemain}`}             
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
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || value <= selectedGrnItem.quantityRemain) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Số lượng lấy ra không được lớn hơn SLCL")
                        );
                      },
                    }),
                  ]}
                  style={{
                    marginTop: '0.8rem'
                  }}
                >
                  <InputNumber
                    min={1}
                    style={{
                      float: 'right',
                      width: '100%'
                    }}
                    size="middle"
                    onPressEnter={handleAddExportItem}
                    addonAfter={
                      <Form.Item noStyle shouldUpdate>
                        {({ getFieldError, getFieldValue }) => {
                          const hasError = getFieldError("quantityTake").length > 0;
                          const isEmpty = !getFieldValue("quantityTake");

                          return (
                            <Button
                              color="primary"
                              variant="outlined"
                              onClick={handleAddExportItem}
                              disabled={hasError || isEmpty}
                            >
                              Thêm
                            </Button>
                          );
                        }}
                      </Form.Item>
                    }
                  />
              </Form.Item>
            </React.Fragment>
          )}

          {/* 4. Display list of selected GRN items */}
          {exportItems.length > 0 && (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={exportItems}
              pagination={false}
              bordered
              size="small"
              style={{
                marginBottom: '0.8rem'
              }}
              scroll={{ y: 250 }}
            />
          )}

          <Form.Item
            label="Tổng số lượng xuất"
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
              disabled={true}
            />
          </Form.Item>
          <Form.Item
            label="Đơn giá bán"
            labelAlign='left'
            name="unitPrice"
            rules={[{required: true, message: "Đơn giá bán không được để trống"}]}
          >
            <InputNumber 
              min={1}
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
      </React.Fragment>
  )
}

export default BaseSalesItemForm
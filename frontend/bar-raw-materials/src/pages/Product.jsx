import React, {useState} from 'react'
import { Card, Input, Select, Pagination, Space, Button, Modal, message, Form } from "antd";
import ProductTable from '../components/product/ProductTable';
import AddProductForm from '../components/product/AddProductForm.jsx';
import { SoundTwoTone } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const Product = () => {
  const [searchText, setSearchText] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  const [addProductForm] = Form.useForm();

  // used for <ProductTable>
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const pageSize = 5;

  // used for <AddProductForm>
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const success = (msg) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    // calling form.submit() will automatically trigger form.validateFields() first
    // for surface validation
    addProductForm.submit();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 0);
  };
  const handleCancel = () => {
    addProductForm.resetFields();
    setOpen(false);
  };

  const handleSuccess = (msg) => {
    success(msg);
    setOpen(false);
    // if new product is added successfully, refresh <ProductTable>
    setRefresh(prev => !prev);
    // clear search text after a product is added successfully
    setSearchText(null);
    // reset current page
    setCurrentPage(1);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    // reset current page
    setCurrentPage(1);
  }

  return (
    <Card
      title={
        <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span style={{ fontWeight: "bold" }}>Bảng sản phẩm</span>
          <Space>
            <Search
              placeholder="Tìm theo tên sản phẩm"
              onSearch={(value) => handleSearch(value)}
              // onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="Filter by Category"
              style={{ width: 180 }}
              allowClear
              onChange={(value) => setCategoryFilter(value)}
            >
              <Option value="Grain">Grain</Option>
              <Option value="Liquid">Liquid</Option>
              <Option value="Powder">Powder</Option>
            </Select>
            <Button 
              type="primary"
              onClick={showModal}
            >
              Thêm sản phẩm
            </Button>
            <Modal
              open={open}
              destroyOnHidden={false}
              title="Thêm sản phẩm"
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Hủy
                </Button>,
                <Button loading={loading} key="submit" type="primary" onClick={handleOk}>
                  Xác nhận
                </Button>
              ]}
            >
              <AddProductForm 
                onSubmitSuccess={handleSuccess}
                form={addProductForm} 
              />
            </Modal>
          </Space>
        </Space>
      }
      variant='bordered'
    >
      {contextHolder}
      <ProductTable 
        currentPage={currentPage} 
        pageSize={pageSize} 
        refresh={refresh} 
        setPageMetadata={setPageMetadata}
        searchText={searchText}
      />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={pageMetadata.page?.totalElements || 0}
          onChange={(page) => setCurrentPage(page)}
          showTotal={(total) => `Hiện đang có ${total} sản phẩm`}
        />
      </div>
    </Card>
  );
}

export default Product
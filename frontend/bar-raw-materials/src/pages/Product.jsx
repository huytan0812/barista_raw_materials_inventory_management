import React, {useState, useEffect} from 'react'
import { Card, Input, Select, Pagination, Space, Button, Modal, message, Form, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import ProductTable from '../components/product/ProductTable';
import AddProductForm from '../components/product/AddProductForm.jsx';
import { useAuthContext } from '../contexts/AuthContext.jsx';
import ctgHTTP from '../services/CategoryService.js'

const { Search } = Input;
const { Option } = Select;

const Product = () => {
  const [addProductForm] = Form.useForm();
  const {token} = useAuthContext();

  // states for handling search and filter
  const [searchText, setSearchText] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  // states for handling <ProductTable>
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const pageSize = 5;

  // states for handling spinner
  const [loadingTable, setLoadingTable] = useState(false);

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
    // clear search text and filter after a product is added successfully
    setSearchText("");
    setCategoryFilter("");
    // reset current page
    setCurrentPage(1);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setLoadingTable(true);
    // reset current page
    setCurrentPage(1);
  }

  const handleFilter = (text) => {
    setCategoryFilter(text);
    setLoadingTable(true);
    // reset current page
    setCurrentPage(1);
  }

  // side effect for fetching categories
  useEffect(() => {
    const fetchCategories = async() => {
      try {
        const response = await ctgHTTP.get('allLight', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setCategoryList(response.data);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchCategories();
  }, [token]);

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
              placeholder="Lọc the danh mục"
              style={{ width: 250 }}
              allowClear
              onChange={(value) => handleFilter(value)}
            >
              {
                categoryList.map(ctg => {
                  return (<Option key={ctg.id} value={ctg.name}>{ctg.name}</Option>)
                })
              }
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
      <Spin
        spinning={loadingTable}
        tip="Đang tải dữ liệu..."
        indicator={<LoadingOutlined spin />}
      >
        <ProductTable 
          currentPage={currentPage} 
          pageSize={pageSize} 
          refresh={refresh} 
          setPageMetadata={setPageMetadata}
          searchText={searchText}
          categoryText={categoryFilter}
          setLoadingTable={setLoadingTable}
        />
      </Spin>
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
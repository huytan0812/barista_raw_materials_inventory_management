import React, {useState} from 'react'
import { Card, Input, Select, Pagination, Space, Button, Modal, message } from "antd";
import ProductTable from '../components/product/ProductTable';
import AddProductForm from '../components/product/AddProductForm.jsx';
import { SoundTwoTone } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const Product = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // used for <ProductTable>
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const pageSize = 5;

  // used for <AddProductForm>
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const success = (msg) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };

  const showModal = () => {
    setOpen(true);
    setRefresh(false);
    setResetForm(false);
  };
  const handleOk = () => {
    setSubmitForm(true);

    setLoading(true);

    // throw three setLoading, setSubmitForm to Web worker
    setTimeout(() => {
      setLoading(false);
      setSubmitForm(false);
    }, 0);
  };
  const handleCancel = () => {
    // use setTimeout here for setOpen to ensure AddProductForm is reset
    // before being unmounted in the next render
    setTimeout(() => {
      setOpen(false);
    });
    setResetForm(true);
  };

  const handleSuccess = (msg) => {
    success(msg);
    setOpen(false);
    // if new product is added successfully, refresh <ProductTable>
    setRefresh(true);
  };

  return (
    <Card
      title={
        <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span style={{ fontWeight: "bold" }}>Bảng sản phẩm</span>
          <Space>
            <Search
              placeholder="Tìm theo tên sản phẩm"
              onSearch={(value) => setSearchText(value)}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
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
              <AddProductForm isSubmit={submitForm} onSubmitSuccess={handleSuccess} resetForm={resetForm} />
            </Modal>
          </Space>
        </Space>
      }
      variant='bordered'
    >
      {contextHolder}
      <ProductTable 
        currentPage={currentPage} pageSize={pageSize} 
        refresh={refresh} setPageMetadata={setPageMetadata}
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
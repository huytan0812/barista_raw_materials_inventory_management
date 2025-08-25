import React, {useState} from 'react'
import { Card, Input, Select, Pagination, Space, Button, Modal } from "antd";
import ProductTable from '../components/product/ProductTable';
import AddProductForm from '../components/product/AddProductForm.jsx';
import { SoundTwoTone } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const Product = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [submitForm, setSubmitForm] = useState(false);

  const showModal = () => {
    setOpen(true);
    setCount(count + 1);
  };
  const handleOk = () => {
    setSubmitForm(true);

    setLoading(true);

    // throw three setLoading, setOpen, setSubmitForm to Web worker
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setSubmitForm(false);
    }, 0);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  return (
    <Card
      title={
        <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span style={{ fontWeight: "bold" }}>Products Table</span>
          <Space>
            <Search
              placeholder="Search by SKU"
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
              <AddProductForm isSubmit={submitForm} />
            </Modal>
          </Space>
        </Space>
      }
      variant='bordered'
    >
      <ProductTable />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={10}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Card>
  );
}

export default Product
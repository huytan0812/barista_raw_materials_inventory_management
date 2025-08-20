import React, {useState} from 'react'
import { Card, Table, Input, Select, Pagination, Space, Button } from "antd";
import ProductTable from '../components/product/ProductTable';

const { Search } = Input;
const { Option } = Select;

const Product = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
            >
              Thêm sản phẩm
            </Button>
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
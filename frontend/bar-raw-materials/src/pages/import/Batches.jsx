import React, {useState} from 'react'
import {Card, Space, Input, Pagination, Select, Spin} from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import BatchTable from '../../components/import/batches/BatchTable'

const {Search} = Input;

const quantityOptions = [
  { label: 'Tăng dần', value: 'asc' },
  { label: 'Giảm dần', value: 'desc' }
];
const quantityLabelRender = (props) => {
  const { label } = props;
  if (label) {
    return `Xếp theo SLCL: ${label}`;
  }
  return <span>Không hợp lệ</span>;
};

const expDateOptions = [
  {label: 'Còn HSD', value: 'valid'},
  {label: "Sắp hết HSD", value: 'aboutToExpire'},
  {label: 'Hết HSD', value: 'expired'}
];
const expDateLabelRender = (props) => {
  const { label } = props;
  if (label) {
    return `Lọc theo: ${label}`;
  }
  return <span>Lọc theo HSD</span>;
};

const Batches = () => {
    // states for handling spinner
    const [loadingTable, setLoadingTable] = useState(false);

    // states for handling search and filter
    const [searchInput, setSearchInput] = useState('');
    const [searchText, setSearchText] = useState(null);
    const [sortInput, setSortInput] = useState('desc');
    const [sortByQuantity, setSortByQuantity] = useState(null);
    const [filterByExpDate, setFilterByExpDate] = useState(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const pageSize = 5;

    const handleBatchSearch = (value) => {
      setCurrentPage(1);
      setSearchText(value);
      // reset filter
      setFilterByExpDate(null);
      setLoadingTable(true);
    }

    const handleSortQuantity = (value) => {
      setCurrentPage(1);
      setSortInput(value);
      setSortByQuantity(value);
      // reset filter
      setFilterByExpDate(null);
      setLoadingTable(true);
    }

    const handleFilterExpDate = (value) => {
      // reset both search and sort
      setSearchInput('');
      setSearchText(null);
      setSortInput('desc');
      setSortByQuantity(null);
      
      setCurrentPage(1);
      setFilterByExpDate(value);
      setLoadingTable(true);
    }

    return (
      <Card
        title={
          <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontWeight: "bold" }}>Bảng lô hàng nhập kho</span>
            <Space>
              <Search 
                placeholder="Tìm lô hàng theo sản phẩm" 
                allowClear 
                onSearch={handleBatchSearch}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ width: 250 }}
              />
              <Select
                labelRender={quantityLabelRender}
                placeholder="Xếp theo SLCL"
                value={sortInput}
                style={{ width: 230 }}
                options={quantityOptions}
                onChange={handleSortQuantity}
                allowClear
              />
              <Select
                labelRender={expDateLabelRender}
                value={filterByExpDate}
                placeholder="Lọc theo HSD"
                style={{ width: 230 }}
                options={expDateOptions}
                onChange={handleFilterExpDate}
                allowClear
              />
            </Space>
          </Space>
        }
        variant='bordered'
      >
        <Spin
          spinning={loadingTable}
          tip="Đang tải dữ liệu..."
          indicator={<LoadingOutlined spin />}
        >
          <BatchTable
            currentPage={currentPage} 
            pageSize={pageSize}
            setPageMetadata={setPageMetadata}
            searchText={searchText}
            sort={sortByQuantity}
            filter={filterByExpDate}
            setLoadingTable={setLoadingTable}
          />
        </Spin>
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={pageMetadata.page?.totalElements || 0}
            onChange={(page) => setCurrentPage(page)}
            showTotal={(total) => `Hiện đang có ${total} lô hàng nhập kho`}
          />
        </div>
      </Card>
    )
}

export default Batches
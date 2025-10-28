import React, {useState} from 'react'
import {Card, Space, Input, Pagination, Select} from 'antd'
import BatchTable from '../../components/import/batches/BatchTable'
import { SearchOutlined } from '@ant-design/icons';

const {Search} = Input;

const options = [
  { label: 'Tăng dần', value: 'asc' },
  { label: 'Giảm dần', value: 'desc' }
];
const expDateLabelRender = (props) => {
  const { label } = props;
  if (label) {
    return `Xếp theo HSD: ${label}`;
  }
  return <span>Không hợp lệ</span>;
};
const quantityLabelRender = (props) => {
  const { label } = props;
  if (label) {
    return `Xếp theo SLCL: ${label}`;
  }
  return <span>Không hợp lệ</span>;
};

const onSearch = (value, _e, info) => console.log(info?.source, value);

const Batches = () => {
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const pageSize = 5;

    return (
      <Card
        title={
          <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontWeight: "bold" }}>Bảng lô hàng nhập kho</span>
            <Space>
              <Search 
                placeholder="Tìm lô hàng theo sản phẩm" 
                allowClear 
                onSearch={onSearch} 
                style={{ width: 250 }}
              />
              <Select
                labelRender={expDateLabelRender}
                defaultValue="asc"
                style={{ width: 230 }}
                options={options}
              />
              <Select
                labelRender={quantityLabelRender}
                defaultValue="asc"
                style={{ width: 230 }}
                options={options}
              />
            </Space>
          </Space>
        }
        variant='bordered'
      >
        <BatchTable
          currentPage={currentPage} 
          pageSize={pageSize}
          setPageMetadata={setPageMetadata}
        />
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
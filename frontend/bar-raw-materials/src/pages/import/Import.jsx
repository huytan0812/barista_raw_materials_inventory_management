import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {Card, Space, Button, Input, Pagination} from 'antd'
import GrnTable from '../../components/import/GrnTable'

const { Search } = Input;

const Import = () => {
  const navigate = useNavigate();
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const pageSize = 5;

  const handleClick = () => {
    navigate('/import/add_grn');
  }

  return (
    <Card
      title={
        <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span style={{ fontWeight: "bold" }}>Bảng phiếu nhập kho</span>
          <Space>
            <Search
              placeholder="Tìm phiếu nhập theo mã"
              style={{ width: 200 }}
              allowClear
            />
            <Button 
              type="primary"
              onClick={handleClick}
            >
              Tạo phiếu nhập
            </Button>
          </Space>
        </Space>
      }
      variant='bordered'
    >
      <GrnTable
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
          showTotal={(total) => `Hiện đang có ${total} phiếu nhập kho`}
        />
      </div>
    </Card>
  )
}

export default Import
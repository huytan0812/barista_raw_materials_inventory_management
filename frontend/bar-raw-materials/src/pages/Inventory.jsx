import React, {useState} from 'react'
import {Card, Space, Input, Pagination, Button} from 'antd'
import InventoryTable from '../components/inventory/InventoryTable'

const {Search} = Input;

const Inventory = () => {
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const pageSize = 5;

  return (
    <React.Fragment>
      <Card
        title={
          <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontWeight: "bold" }}>Bảng hàng tồn kho</span>
            <Space>
              <Search
                placeholder="Tìm sản phẩm theo tên"
                style={{ width: 200 }}
                allowClear
              />
              <Button 
                type="primary"
              >
                Kết chuyển hàng tồn kho
              </Button>
            </Space>
          </Space>
        }
        variant='bordered'
      >
        <InventoryTable
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
            showTotal={(total) => `Hiện đang có ${total} sản phẩm`}
          />
        </div>
      </Card>
    </React.Fragment>
  )
}

export default Inventory
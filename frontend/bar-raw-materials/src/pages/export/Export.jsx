import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {Card, Space, Button, Input, Pagination} from 'antd'
import SalesOrderTable from '../../components/export/sales_order/SalesOrderTable';

const { Search } = Input;

const Export = () => {
    const navigate = useNavigate();
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const pageSize = 5;

    const handleClick = () => {
        navigate('/export/add_sales_order');
    }

    return (
        <Card
            title={
                <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <span style={{ fontWeight: "bold" }}>Bảng phiếu xuất kho</span>
                <Space>
                    <Search
                    placeholder="Tìm phiếu xuất theo mã"
                    style={{ width: 200 }}
                    allowClear
                    />
                    <Button 
                    type="primary"
                    onClick={handleClick}
                    >
                    Tạo phiếu xuất
                    </Button>
                </Space>
                </Space>
            }
            variant='bordered'
        >
        <SalesOrderTable
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
                showTotal={(total) => `Hiện đang có ${total} phiếu xuất kho`}
            />
        </div>
        </Card>
    )
}

export default Export
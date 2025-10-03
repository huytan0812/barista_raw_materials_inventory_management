import React, {useState} from 'react'
import {Card, Pagination} from 'antd'
import VATCards from '../components/vat/VATCards'
import VATTable from '../components/vat/VATTable'

const VAT = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const PAGE_SIZE = 5;
    return (
        <React.Fragment>
            <Card
                title="Tổng quan thuế"
            >
                <VATCards />
            </Card>
            <Card
                title="Thống kê thuế theo từng sản phẩm"
            >
                <VATTable
                    currentPage={currentPage}
                    pageSize={PAGE_SIZE}
                    setPageMetadata={setPageMetadata}
                />
                <div style={{ textAlign: "right", marginTop: 16 }}>
                    <Pagination
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={pageMetadata.page?.totalElements || 0}
                        onChange={(page) => setCurrentPage(page)}
                        showTotal={(total) => `Hiện đang có ${total} lô hàng`}
                    />
                </div>
            </Card>
        </React.Fragment>
    )
}

export default VAT
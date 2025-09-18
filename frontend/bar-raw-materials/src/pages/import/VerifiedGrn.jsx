import React, {useState} from 'react'
import { useParams, NavLink } from 'react-router-dom'
import {Card, Tag, Breadcrumb, Pagination} from 'antd'
import VerifiedGrnDetails from '../../components/import/verified_grn/VerifiedGrnDetails'
import VerifiedGrnItems from '../../components/import/verified_grn/VerifiedGrnItems'

const VerifiedGrn = () => {
  const params = useParams();
  const grnId = params.grnId;

  // GRN items pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const PAGE_SIZE = 5;

  return (
  <React.Fragment>
    <div>
      <Breadcrumb 
        items={
          [ {
              title:  (<NavLink to="/import">
                      <span>Nhập kho</span>
                      </NavLink>)
          },
          {
              title: `Chi tiết phiếu nhập có mã số ${grnId}`
          }
          ]
        }
      />
    </div>
      <Card 
        title={
          <h3 
            style={{
              textAlign: 'center',
              fontSize: '2rem'
            }}
          >
            Phiếu nhập kho
          </h3>
        }
        extra={
          <Tag color="green">Đã phê duyệt</Tag>
        }
        style={{
          maxWidth: '1080px',
          margin: '0.8rem auto'
        }}
        styles={{
          body: {
              padding: '12px 12px'
          }
        }}
      >
        <VerifiedGrnDetails
            grnId={grnId}
        />
        <Card
          style={{
              marginTop: '0.8rem'
          }}
          title="Danh sách các lô sản phẩm nhập"
          variant='bordered'
        >
          <VerifiedGrnItems
              grnId={grnId}
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
            showTotal={(total) => `Tổng cộng ${total} lô hàng nhập`}
          />
          </div>
        </Card>
      </Card>
  </React.Fragment>
  )
}

export default VerifiedGrn
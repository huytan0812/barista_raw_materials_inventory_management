import React, {useState} from 'react'
import {Card, Space, Button, Pagination, message} from 'antd'
import { useNavigate } from 'react-router-dom'
import ReportsTable from '../components/reports/ReportsTable'
import { useAuthContext } from '../contexts/AuthContext'
import dailyReportHTTP from '../services/DailyReportService'

const Report = () => {
  const {token} = useAuthContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const [refresh, setRefresh] = useState(false);
  const pageSize = 5;

  const popUpMsg = (type, msg) => {
    messageApi.open({
      type: type,
      content: msg,
      duration: 1.5,
    })
  };

  const handleGenerateDailyReport = () => {
    const genDailyReport = async () => {
      try {
        const response = await dailyReportHTTP.get("generateDailyReport", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          popUpMsg("success", "Báo cáo được tạo thành công");
          setRefresh(prev=>!prev);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    genDailyReport();
  }

  return (
    <React.Fragment>
      <Card
        title={
          <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontWeight: "bold" }}>Bảng bảo cáo hằng ngày</span>
            <Space>
              <Button 
                type="primary"
                onClick={handleGenerateDailyReport}
              >
                Tạo báo cáo
              </Button>
            </Space>
          </Space>
        }
        variant='bordered'
      >
        {contextHolder}
        <ReportsTable
          currentPage={currentPage} 
          pageSize={pageSize}
          setPageMetadata={setPageMetadata}
          refresh={refresh}
          setRefresh={setRefresh}
        />
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={pageMetadata.page?.totalElements || 0}
            onChange={(page) => setCurrentPage(page)}
            showTotal={(total) => `Hiện đang có ${total} báo cáo`}
          />
        </div>
      </Card>
    </React.Fragment>
  )
}

export default Report
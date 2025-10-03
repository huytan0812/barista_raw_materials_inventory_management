import React, {useState, useEffect, useRef} from 'react'
import {Table, Button, Flex} from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import dailyReportHTTP from '../../services/DailyReportService'

const ReportsTable = (props) => {
  const {
    setPageMetadata,
    currentPage,
    pageSize,
    refresh
  } = props;
  const navigate = useNavigate();
  const {token} = useAuthContext();
  const persistToken = useRef(token);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async() => {
      try {
        const response = await dailyReportHTTP.get('list', {
          headers: {
            Authorization: `Bearer ${persistToken.current}`
          },
          params: {
            page: currentPage - 1,
            size: pageSize
          }
        });
        if (response.status === 200) {
          setReports(response.data.content);
          const {content:_, ...rest} = response.data;
          setPageMetadata(rest);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchReports();
  }, [currentPage, pageSize, refresh]);

  const columns = [
        {
            title: "STT",
            key: "index",
            render: (text, record, index) => index + 1,
            align: "center"
        },
        {
            title: "Ngày tạo",
            dataIndex: "reportDate",
            key: "reportDate",
            render: (value) => {
                return new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }).format(new Date(value));
            },
            align: "center"
        },
        {
            title: "Người tạo",
            key: "createdByUser",
            render: (_,record) => {
              return record?.createdBy?.username
            },
            align: "center"
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => {
                return (
                  <Flex justify='center'>
                    <Button 
                      color="blue" 
                      variant="solid" 
                      onClick={() => navigate(`/reports/${record?.id}`)}
                    >
                      <span style={{fontSize: '1.4rem'}}>Chi tiết</span>
                    </Button>
                  </Flex>
                )
            }
        }
    ]

  return (
    <Table
      columns={columns}
      dataSource={reports.map(record => ({...record, key: record.id}))}
      pagination={false}
    />
  )
}

export default ReportsTable
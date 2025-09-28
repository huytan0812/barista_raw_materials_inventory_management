import React, {useState, useEffect, useRef} from 'react'
import {useParams, NavLink} from 'react-router-dom'
import { Breadcrumb, Card, Pagination } from 'antd'
import { useAuthContext } from '../../contexts/AuthContext'
import ProductDailyReport from '../../components/reports/ProductDailyReport'
import dailyReportHTTP from '../../services/DailyReportService'
import dayjs from "dayjs"

const ReportDetails = () => {
    const params = useParams();
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [report, setReport] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageMetadata, setPageMetadata] = useState({});
    const PAGE_SIZE = 5;

    useEffect(() => {
        const fetchReport = async() => {
            try {
                const response = await dailyReportHTTP.get(`details/${params.reportId}`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    console.log(response.data);
                    setReport(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchReport();
    }, [params]);

    return (
        <React.Fragment>
            <Breadcrumb 
                items={
                    [ {
                        title:  (<NavLink to="/reports">
                                    <span>Báo cáo</span>
                                </NavLink>)
                    },
                    {
                        title: "Chi tiết báo cáo"
                    }
                    ]
                }
            />
            <Card
                title={`Báo cáo hằng ngày ${dayjs(report?.reportDate).format("DD/MM/YYYY")}`}
                style={{
                    marginTop: '0.8rem'
                }}
            >
                    <ProductDailyReport
                        reportId={params.reportId}
                        setPageMetadata={setPageMetadata}
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                    />
                    <div style={{ textAlign: "right", marginTop: 16 }}>
                        <Pagination
                            current={currentPage}
                            pageSize={PAGE_SIZE}
                            total={pageMetadata.page?.totalElements || 0}
                            onChange={(page) => setCurrentPage(page)}
                            showTotal={(total) => `Hiện đang có ${total} sản phẩm`}
                        />
                    </div>
                </Card>
        </React.Fragment>
    )
}

export default ReportDetails
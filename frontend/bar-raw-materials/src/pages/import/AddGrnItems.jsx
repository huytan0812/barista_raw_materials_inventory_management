import React from 'react'
import { useParams } from 'react-router-dom'
import {Card, Flex, Button, Space} from 'antd'
import GrnDetails from '../../components/import/add/GrnDetails'
import GrnItems from '../../components/import/add/GrnItems'

const AddGrnItems = () => {
    const params = useParams();
    return (
        <React.Fragment>
            <Card 
                title={<h3 
                        style={{
                            textAlign: 'center',
                            fontSize: '2rem'
                        }}
                    >
                    Phiếu nhập kho
                    </h3>
                }
                style={{
                    width: '966px',
                    margin: 'auto'
                }}
            >
                <GrnDetails
                    params={params}
                />
                <Card
                    title={
                    <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <span style={{ fontWeight: "bold" }}>Danh sách các lô sản phẩm nhập</span>
                        <Space>
                            <Button 
                                type="primary"
                            >
                            Thêm sản phẩm
                            </Button>
                        </Space>
                    </Space>
                }
                variant='bordered'
                >
                    <GrnItems />
                </Card>
            </Card>
        </React.Fragment>
    )
}

export default AddGrnItems
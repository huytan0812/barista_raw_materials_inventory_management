import { Breadcrumb } from 'antd'
import React from 'react'
import Sales from '../components/dashboard/Sales'

const Dashboard2 = () => {
  return (
    <React.Fragment>
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Dashboard 2</Breadcrumb.Item>
            </Breadcrumb>
        </div>
        <Sales />
    </React.Fragment>
  )
}

export default Dashboard2
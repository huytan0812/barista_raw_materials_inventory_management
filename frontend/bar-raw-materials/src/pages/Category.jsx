import React from 'react'
import {Breadcrumb} from 'antd'
import CategoryTable from'../components/category/CategoryTable'

const Category = () => {
  return (
    <React.Fragment>
      <Breadcrumb
        items={
          [
            {
              'title': 'Home'
            },
            {
              'title': "Danh mục sản phẩm"
            }
          ]
        }
      />
      <CategoryTable />
    </React.Fragment>
  )
}

export default Category
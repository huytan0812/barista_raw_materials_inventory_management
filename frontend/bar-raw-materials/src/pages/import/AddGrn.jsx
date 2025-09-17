import React from 'react'
import {Flex, Breadcrumb} from 'antd'
import {NavLink} from 'react-router-dom'
import AddGrnForm from '../../components/import/grn/AddGrnForm'

const AddGrn = () => {
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
                title: "Tạo phiếu nhập"
              }
            ]
          }
        />
      </div>
      <Flex 
        justify='center' 
        align='center' 
        style={{
          width: '100%',
          marginTop: '0.8rem'
        }}
      >
        <AddGrnForm />
      </Flex>
    </React.Fragment>
  )
}

export default AddGrn
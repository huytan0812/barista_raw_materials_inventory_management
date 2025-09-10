import React from 'react'
import {Flex} from 'antd'
import AddGrnForm from '../../components/import/add/AddGrnForm'

const AddGrn = () => {
  return (
    <React.Fragment>
      <Flex justify='center' align='center' style={{width: '100%'}}>
        <AddGrnForm />
      </Flex>
    </React.Fragment>
  )
}

export default AddGrn
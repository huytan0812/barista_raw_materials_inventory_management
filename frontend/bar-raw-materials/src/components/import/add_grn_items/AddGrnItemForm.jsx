import React from 'react'
import BaseGrnItemForm from './BaseGrnItemForm'

const onDateChange = (date, dateString) => {
  console.log(date, dateString);
};

const AddGrnItemForm = (props) => {
  const {
    form,
    handleSubmit,
    grnId
  } = props;

  return (
    <React.Fragment>
      <BaseGrnItemForm 
        form={form}
        formName="addGrnItem"
        handleSubmit={handleSubmit}
        onDateChange={onDateChange}
        mode="add"
        grnId={grnId} 
      />
    </React.Fragment>
  )
}

export default AddGrnItemForm
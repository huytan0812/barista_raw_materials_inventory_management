import React from 'react'
import BaseGrnItemForm from './BaseGrnItemForm'

const onDateChange = (date, dateString) => {
  console.log(date, dateString);
};

const EditGrnItemForm = (props) => {
    const {
        form,
        handleSubmit,
        grnItem
    } = props;

    return (
        <React.Fragment>
            <BaseGrnItemForm
                form={form}
                formName={`edit_grn_item_${grnItem.id}`}
                handleSubmit={handleSubmit}
                onDateChange={onDateChange}
                mode="update"
                grnId={grnItem?.grnId}
                grnItem={grnItem}
            />
        </React.Fragment>
    )
}

export default EditGrnItemForm
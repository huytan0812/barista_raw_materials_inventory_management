import React from 'react'
import BaseVendorForm from './BaseVendorForm'

const EditVendorForm = (props) => {
    const {
        form,
        handleSubmit,
        vendorId
    } = props;
    return (
        <BaseVendorForm
            form={form}
            formName={`edit_vendor_${vendorId}`}
            handleSubmit={handleSubmit}
            mode="update"
            vendorId={vendorId}
        />
    )
}

export default EditVendorForm
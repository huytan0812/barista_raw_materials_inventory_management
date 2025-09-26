import React from 'react'
import BaseSalesItemForm from './BaseSalesItemForm'
import { useAuthContext } from '../../../contexts/AuthContext'
import salesItemHTTP from '../../../services/SalesOrderItemService'

const AddSalesItemForm = (props) => {
    const {
        salesOrderId,
        salesItem,
        form,
        onSubmitSuccess,
        onSubmitFailure
    } = props;
    const {token} = useAuthContext();

    const handleSubmit = (values) => {
        const submit = async() => {
            const formData = new FormData();
            const {salesItemId, ...rest} = values;
            const data = rest;
            // convert vat rate to percentage
            if (data.vatRate) data.vatRate /= 100;
            if (data.discount) data.discount /= 100;
            formData.append('data', new Blob([JSON.stringify(data)], {type: 'application/json'}))
            try {
                const response = await salesItemHTTP.post(`/confirmSaleItem/${salesItem.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    onSubmitSuccess("Thêm hàng bán thành công");
                }
            }
            catch (error) {
                const responseErr = error.response;
                onSubmitFailure(responseErr?.data);
            }
        }
        submit();
    }

    return (
        <BaseSalesItemForm
            salesItem={salesItem}
            form={form}
            formName="add_sales_item"
            handleSubmit={handleSubmit}
        />
    )
}

export default AddSalesItemForm
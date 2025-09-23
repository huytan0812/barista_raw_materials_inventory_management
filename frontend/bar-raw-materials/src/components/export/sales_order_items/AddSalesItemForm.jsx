import React from 'react'
import BaseSalesItemForm from './BaseSalesItemForm'
import { useAuthContext } from '../../../contexts/AuthContext'
import salesItemHTTP from '../../../services/SalesOrderItemService'

const AddSalesItemForm = (props) => {
    const {
        salesOrderId,
        form,
        onSubmitSuccess,
        onSubmitFailure
    } = props;
    const {token} = useAuthContext();

    const handleSubmit = (values) => {
        const submit = async() => {
            const formData = new FormData();
            try {
                const response = await salesItemHTTP.post('/add', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
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
            form={form}
            formName="add_sales_item"
            handleSubmit={handleSubmit}
        />
    )
}

export default AddSalesItemForm
import React, {useState, useEffect, useRef} from 'react'
import { useAuthContext } from '../../../contexts/AuthContext'
import salesItemHTTP from '../../../services/SalesOrderItemService'
import exportItemHTTP from '../../../services/ExportItemService'
import BaseSalesItemForm from './BaseSalesItemForm'

const EditSalesItemForm = (props) => {
    const {
        form,
        salesItem,
        handleSubmitSuccess,
        handleSubmitFail,
        setCancelExpItemIds
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [expItems, setExpItems] = useState([]);

    // side effect for fetching Export Item based on Sales Order Item
    useEffect(() => {
        const fetchExportItems = async() => {
            try {
                const response = await exportItemHTTP.get(`salesItem/${salesItem.id}/list`, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`
                    }
                });
                if (response.status === 200) {
                    const data = response.data;
                    setExpItems(data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchExportItems();
    }, [form, salesItem]);

    // submitting to server
    const handleSubmit = (values) => {
        const submit = async() => {
            try {
                const formData = new FormData();
                const {salesItemId,...rest} = values;
                const data = rest;
                // convert vat rate to percentage
                if (data.vatRate) data.vatRate /= 100;
                if (data.discount) data.discount /= 100;
                formData.append('data', new Blob([JSON.stringify(data)], {type: 'application/json'}));

                const response = await salesItemHTTP.post(`/update/${salesItem.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200) {
                    form.resetFields();
                    handleSubmitSuccess("Đơn hàng bán được cập nhật thành công");
                }
            }
            catch (error) {
                handleSubmitFail(error);
            }
        }
        submit();
    }

    return (
        <BaseSalesItemForm
            salesItem={salesItem}
            form={form}
            formName={`edit_sales_item_${salesItem.id}`}
            handleSubmit={handleSubmit}
            // for edit Sales Order Item
            edit={true}
            expItems={expItems}
            setCancelExpItemIds={setCancelExpItemIds}
        />
    )
}

export default EditSalesItemForm
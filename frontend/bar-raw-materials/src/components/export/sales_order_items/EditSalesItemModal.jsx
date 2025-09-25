import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'antd'
import EditSalesItemForm from './EditSalesItemForm'
import { useAuthContext } from '../../../contexts/AuthContext'
import expItemHTTP from '../../../services/ExportItemService'

const EditSalesItemModal = (props) => {
    const {
        isActive,
        salesItem, 
        resetActiveEditModal, 
        onEditSuccess, 
        popUpMsg
    } = props;
    const {token} = useAuthContext();
    // states for handling open and close modal
    const [open, setOpen] = useState(false);
    // states for handling form
    const [editSalesItemForm] = Form.useForm();
    // states for handling cancel edit button
    const [cancelExpItemIds, setCancelExpItemIds] = useState([]);

    const handleOk = () => {
        editSalesItemForm.submit();
    }
    const handleCancel = () => {
        setOpen(false);
        resetActiveEditModal();
        console.log("List of cancel export item ids:", cancelExpItemIds);
        // call api to server placeholder
        const cancelNewExpItems = async() => {
            try {
                const response = await expItemHTTP.post("deleteCancelExpItems", cancelExpItemIds,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    // reset list of cancel expItemIds
                    setCancelExpItemIds([]);
                    onEditSuccess("Hủy chỉnh sửa đơn hàng bán thành công");
                }
            }
            catch (error) {
                console.log(error);
                popUpMsg("error", "Hủy chỉnh sửa đơn hàng bán thất bại")
            }
        }
        if (cancelExpItemIds.length > 0) cancelNewExpItems();
        else onEditSuccess("Hủy chỉnh sửa đơn hàng bán thành công");
    }
    const handleSubmitSuccess = (msg) => {
        onEditSuccess(msg);
        // close modal
        setOpen(false);
    }
    const handleSubmitFail = (error) => {
        const responseErr = error.response;
        popUpMsg(responseErr.failToCreate);
    }

    // side effect for open modal
    useEffect(() => {
        if (isActive) setOpen(true);
    }, [isActive]);

    return (
        <Modal
            title="Sửa"
            open={open}
            style={{
                fontSize: '1.4rem',
            }}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnHidden={true}
            footer={
            <>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" onClick={handleOk}>
                    Xác nhận
                </Button>
            </>
            }
            width={768}
        >
            <EditSalesItemForm
                form={editSalesItemForm}
                salesItem={salesItem}
                handleSubmitSuccess={handleSubmitSuccess}
                handleSubmitFail={handleSubmitFail}
                setCancelExpItemIds={setCancelExpItemIds}
            />
        </Modal>
    )
}

export default EditSalesItemModal

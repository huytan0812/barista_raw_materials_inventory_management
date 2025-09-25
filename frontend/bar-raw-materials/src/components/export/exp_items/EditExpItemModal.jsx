import React, {useState, useEffect, useRef} from 'react'
import {Modal, Button, Form} from 'antd'
import EditExpItemForm from './EditExpItemForm';
import { useAuthContext } from '../../../contexts/AuthContext';
import exportItemHTTP from '../../../services/ExportItemService'
import grnItemHTTP from '../../../services/GoodsReceiptItemService'

const EditExpItemModal = (props) => {
    const {
        isActive,
        expItem,
        onEditSuccess,
        onEditFailure,
        resetActiveEditModal
    } = props;
    const {token} = useAuthContext();
    const persistToken = useRef(token);
    const [open, setOpen] = useState(false);
    const [quantityRemain, setQuantityRemain] = useState(null);
    const [editExpItemForm] = Form.useForm();

    // side effect for handling open modal
    useEffect(() => {
        if (isActive) {
            setOpen(true);
            const fetchQuantityRemain = async() => {
                try {
                    const response = await grnItemHTTP.get(`grnItem/${expItem.grnItemId}/quantityRemain`, {
                        headers: {
                            Authorization: `Bearer ${persistToken.current}`
                        }
                    });
                    if (response.status === 200) {
                        editExpItemForm.setFieldsValue({ 
                            quantityRemain: response.data?.quantityRemain,
                            quantityTakeBefore: expItem.quantityTake,
                            quantityTake: expItem.quantityTake
                        });
                        setQuantityRemain(response.data?.quantityRemain);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            fetchQuantityRemain();
        }
    }, [isActive, expItem, editExpItemForm]);

    const handleOk = () => {
        editExpItemForm.submit();
    }
    const handleCancel = () => {
        setOpen(false);
        resetActiveEditModal();
    }
    const handleSubmit = (values) => {
        const {quantityTake, ...rest} = values;
        const editExpItem = async() => {
            try {
                const response = await exportItemHTTP.post(`/update/${expItem.id}`, quantityTake, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setOpen(false);
                    resetActiveEditModal();
                    onEditSuccess(response.data);
                }
            }
            catch (error) {
                const responseErr = error.response;
                onEditFailure(responseErr?.data)
            }
        }
        editExpItem();
    };

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
        >
            <EditExpItemForm
                form={editExpItemForm}
                expItem={expItem}
                quantityRemain={quantityRemain}
                handleSubmit={handleSubmit}
            />
        </Modal>
    )
}

export default EditExpItemModal
import React, {useState, useEffect} from 'react'
import {Modal, Button, Form} from 'antd'
import EditVendorForm from './EditVendorForm'
import { useAuthContext } from '../../contexts/AuthContext'
import vendorHTTP from '../../services/VendorService'

const EditVendorModal = (props) => {
    const {
        isActive,
        vendorId,
        resetActiveEditModal,
        onUpdateSuccess,
        failMsg
    } = props;

    const {token} = useAuthContext();
    // states for handling open and close modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // states for handling form
    const [editVendorForm] = Form.useForm();

    const handleOk = () => {
      editVendorForm.submit();
      setLoading(true);

      setTimeout(() => {
          setLoading(false);
      })
    }
    const handleCancel = () => {
        setOpen(false);
        resetActiveEditModal();
    }

    // submitting to server
    const handleSubmit = (values) => {
        const submit = async() => {
            try {
                const formData = new FormData();
                const {businessImage, foodSafetyCertImage, ...rest} = values;
                const data = rest;
                // set image name to blank string by default
                data.businessLicenseImgName = '';
                data.foodSafetyCertImgName = '';

                // when user doesn't change image
                if (businessImage != null && businessImage.length != 0) {
                    // set the existing image name to backend
                    data.businessLicenseImgName = businessImage[0].name;
                }
                // when user uploads new image
                if (businessImage?.[0]?.originFileObj) {
                    data.businessLicenseImgName = '';
                    formData.append('businessImage', businessImage[0].originFileObj);
                }

                if (foodSafetyCertImage != null && foodSafetyCertImage.length != 0) {
                    data.foodSafetyCertImgName = foodSafetyCertImage[0].name;
                }
                if (foodSafetyCertImage?.[0]?.originFileObj) {
                    data.foodSafetyCertImgName = '';
                    formData.append('foodSafetyCertImage', foodSafetyCertImage[0].originFileObj);
                }

                formData.append('data', new Blob([JSON.stringify(data)], {type: 'application/json'}));

                const response = await vendorHTTP.post(`/update/${vendorId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200) {
                    editVendorForm.resetFields();
                    handleSubmitSuccess("Nhà cung cấp đã được cập nhật thành công");
                }
            }
            catch (error) {
                handleSubmitFail(error);
            }
        }
        submit();
    }

    const handleSubmitSuccess = (msg) => {
        onUpdateSuccess(msg);
        // close modal
        setOpen(false);
    }

    const handleSubmitFail = (error) => {
        const responseErr = error.response;
        if (responseErr.data) {
            failMsg("Có lỗi xảy ra");
        }
        if (responseErr.data?.duplicatedTaxCode) {
            editVendorForm.setFields([
                {
                    name: 'taxCode',
                    errors: [responseErr.data.duplicatedTaxCode]
                }
            ]);
        }
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
            <Button loading={loading} type="primary" onClick={handleOk}>
                Xác nhận
            </Button>
        </>
        }
    >
        <EditVendorForm
            form={editVendorForm}
            vendorId={vendorId}
            handleSubmit={handleSubmit}
        />
    </Modal>
  )
}

export default EditVendorModal
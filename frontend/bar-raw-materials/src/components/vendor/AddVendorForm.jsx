import React, {useRef} from 'react'
import BaseVendorForm from './BaseVendorForm';
import {useAuthContext} from '../../contexts/AuthContext'
import vendorHTTP from '../../services/VendorService'

const AddVendorForm = (props) => {
    const { failMsg, onSubmitSuccess, form } = props;
    const { token } = useAuthContext();
    const persistToken = useRef(token);
    
    const handleSubmit = (values) => {
        console.log(values);
        const submitData = async() => {
            try {
                const formData = new FormData();
                const businessImgFile = values.businessImage?.[0]?.originFileObj;
                const foodSafetyCertImgFile = values.foodSafetyCertImage?.[0]?.originFileObj;
                let data = {...values};

                if (businessImgFile) {
                    formData.append('businessImage', businessImgFile);
                    // remove business image in field values
                    const {businessImage:_, ...rest} = data;
                    data = rest;
                }
                if (foodSafetyCertImgFile) {
                    formData.append('foodSafetyCertImage', foodSafetyCertImgFile);
                    // remove food safety cert image in field values
                    const {foodSafetyCertImage:_, ...rest} = data;
                    data = rest;
                }
                console.log("Data:", data);
                formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

                const response = await vendorHTTP.post("/add", formData, {
                    headers: {
                        Authorization: `Bearer ${persistToken.current}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response.data);
                if (response.status === 200) {
                    onSubmitSuccess(`Nhà cung cấp ${values.name} đã được thêm thành công`);
                    form.resetFields();
                }
            }
            catch (error) {
                console.log(error);
                const errors = error?.response?.data;
                if (errors.duplicatedTaxCode) {
                    form.setFields([
                        {
                            name: 'taxCode',
                            errors: [errors.duplicatedTaxCode]
                        }
                    ]);
                }
                else {
                    failMsg(errors.data ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            }
        }
        submitData();
    }
    
    return (
        <BaseVendorForm
            form={form}
            handleSubmit={handleSubmit}
            mode="add"
            formName="add_vendor_form"
        />
    )
}

export default AddVendorForm
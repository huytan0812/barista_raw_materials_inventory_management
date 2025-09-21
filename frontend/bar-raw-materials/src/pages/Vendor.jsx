import React, {useState} from 'react'
import { Card, Input, Select, Pagination, Space, Button, Modal, message, Form, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import VendorTable from '../components/vendor/VendorTable.jsx';
import AddVendorForm from '../components/vendor/AddVendorForm.jsx';

const { Search } = Input;

const Vendor = () => {
  const [addVendorForm] = Form.useForm();
  // states for handling search
  const [searchText, setSearchText] = useState(null);

  // states for handling <VendorTable>
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const pageSize = 5;

  // states for handling spinner
  const [loadingTable, setLoadingTable] = useState(false);

  // used for <AddVendorForm>
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const successMsg = (msg) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };

  const failMsg = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
    })
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    // calling form.submit() will automatically trigger form.validateFields() first
    // for surface validation
    addVendorForm.submit();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 0);
  };
  const handleCancel = () => {
    addVendorForm.resetFields();
    setOpen(false);
  };

  const handleSuccess = (msg) => {
    successMsg(msg);
    setOpen(false);
    // if new vendor is added successfully, refresh <VendorTable>
    setRefresh(prev => !prev);
    // clear search text and filter after a vendor is added successfully
    setSearchText("");
    // reset current page
    setCurrentPage(1);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setLoadingTable(true);
    // reset current page
    setCurrentPage(1);
  }

  return (
    <Card
      title={
        <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span style={{ fontWeight: "bold" }}>Bảng nhà cung cấp</span>
          <Space>
            <Search
              placeholder="Tìm theo tên nhà cung cấp"
              onSearch={(value) => handleSearch(value)}
              // onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button 
              type="primary"
              onClick={showModal}
            >
              Thêm nhà cung cấp
            </Button>
            <Modal
              open={open}
              destroyOnHidden={false}
              title="Thêm nhà cung cấp"
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Hủy
                </Button>,
                <Button loading={loading} key="submit" type="primary" onClick={handleOk}>
                  Xác nhận
                </Button>
              ]}
            >
              <AddVendorForm
                failMsg={failMsg}
                onSubmitSuccess={handleSuccess}
                form={addVendorForm}
              />
            </Modal>
          </Space>
        </Space>
      }
      variant='bordered'
    >
      {contextHolder}
      <Spin
        spinning={loadingTable}
        tip="Đang tải dữ liệu..."
        indicator={<LoadingOutlined spin />}
      >
        <VendorTable
          success={successMsg}
          failMsg={failMsg}
          currentPage={currentPage} 
          pageSize={pageSize} 
          refresh={refresh} 
          setPageMetadata={setPageMetadata}
          searchText={searchText}
          setLoadingTable={setLoadingTable}
        />
      </Spin>
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={pageMetadata.page?.totalElements || 0}
          onChange={(page) => setCurrentPage(page)}
          showTotal={(total) => `Hiện đang có ${total} nhà cung cấp`}
        />
      </div>
    </Card>
  );
}

export default Vendor
import React, {useState} from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import {Card, Space, Button, Pagination, Modal, Form, message} from 'antd'
import AccountTable from '../components/accounts/AccountTable';
import AddAccountForm from '../components/accounts/AddAccountForm';

const Accounts = () => {
  const {user} = useAuthContext();
  const [addAccountForm] = Form.useForm();

  const [refreshUsers, setRefreshUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageAPI, contextHolder] = message.useMessage();

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageMetadata, setPageMetadata] = useState({});
  const pageSize = 5;

  const popUpMsg = (type, msg) => {
    messageAPI.open({
      type: type,
      content: msg
    });
  }

  const showModal = () => {
      setOpen(true);
  };
  const handleOk = () => {
      addAccountForm.submit();
  };
  const handleCancel = () => {
      addAccountForm.resetFields();
      setOpen(false);
  };

  const handleAddUserSuccess = () => {
    setOpen(false);
  }

  return (
    <Card
      title={
        <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span style={{ fontWeight: "bold" }}>Danh sách tài khoản nhân viên</span>
          <Space>
            <Button 
              type="primary"
              onClick={showModal}
            >
              Tạo tài khoản
            </Button>
            <Modal
              open={open}
              destroyOnHidden={true}
              title="Thêm tài khoản"
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                  <Button key="back" onClick={handleCancel}>
                      Hủy
                  </Button>
                  ,
                  <Button key="submit" type="primary" onClick={handleOk}>
                      Xác nhận
                  </Button>
              ]}
            >
              <AddAccountForm
                  form={addAccountForm}
                  formName="add_account"
                  popUpMsg={popUpMsg}
                  setRefreshUsers={setRefreshUsers}
                  handleAddUserSuccess={handleAddUserSuccess}
              />
            </Modal>
          </Space>
        </Space>
      }
      variant='bordered'
    >
      {contextHolder}
      <AccountTable
        currentPage={currentPage} 
        pageSize={pageSize}
        setPageMetadata={setPageMetadata}
        refreshUsers={refreshUsers}
        setRefreshUsers={setRefreshUsers}
      />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={pageMetadata.page?.totalElements || 0}
          onChange={(page) => setCurrentPage(page)}
          showTotal={(total) => `Hiện đang có ${total} tài khoản`}
        />
      </div>
    </Card>
  )
}

export default Accounts
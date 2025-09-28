import React, {useState} from 'react'
import {Breadcrumb, Card, Space, Button, Pagination, Modal, Form, message} from 'antd'
import CategoryTable from '../components/category/CategoryTable'
import AddCategoryForm from '../components/category/AddCategoryForm'

const Category = () => {
  const [addCategoryForm] = Form.useForm();

  const [refreshCtgs, setRefreshCtgs] = useState(false);
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
      addCategoryForm.submit();
  };
  const handleCancel = () => {
      addCategoryForm.resetFields();
      setOpen(false);
  };

  const handleAddCtgSuccess = () => {
    setOpen(false);
  }

  return (
    <React.Fragment>
      <Breadcrumb
        items={
          [
            {
              'title': 'Home'
            },
            {
              'title': "Danh mục sản phẩm"
            }
          ]
        }
      />
      <Card
        title={
          <Space style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontWeight: "bold" }}>Danh sách danh mục</span>
            <Space>
              <Button 
                type="primary"
                onClick={showModal}
              >
                Tạo danh mục
              </Button>
              <Modal
                open={open}
                destroyOnHidden={true}
                title="Thêm danh mục"
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
                <AddCategoryForm
                    form={addCategoryForm}
                    formName="add_category"
                    popUpMsg={popUpMsg}
                    setRefreshCtgs={setRefreshCtgs}
                    handleAddCtgSuccess={handleAddCtgSuccess}
                />
              </Modal>
            </Space>
          </Space>
        }
        variant='bordered'
      >
      {contextHolder}
      <CategoryTable
        currentPage={currentPage} 
        pageSize={pageSize}
        setPageMetadata={setPageMetadata}
        refreshCtgs={refreshCtgs}
        setRefreshCtgs={setRefreshCtgs}
      />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={pageMetadata.page?.totalElements || 0}
          onChange={(page) => setCurrentPage(page)}
          showTotal={(total) => `Hiện đang có ${total} danh mục`}
        />
      </div>
      </Card>
    </React.Fragment>
  )
}

export default Category
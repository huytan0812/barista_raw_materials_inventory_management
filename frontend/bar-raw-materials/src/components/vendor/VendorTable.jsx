import React, {useState, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom';
import {Table, Image, Flex, Button} from 'antd';
import { useAuthContext } from '../../contexts/AuthContext';
import EditVendorModal from './EditVendorModal'
import DeleteVendorModal from './DeleteVendorModal'
import vendorHTTP from '../../services/VendorService'

const VendorTable = (props) => {
  const {
    success,
    currentPage,
    pageSize,
    refresh,
    setPageMetadata,
    searchText,
    setLoadingTable
  } = props;
  // fetching data from server
  const [data, setData] = useState([]);
  const [refreshAfterAction, setRefreshAfterAction] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthContext();

  // handling active modal corresponding to the onClick event trigger
  // from a edit button on a vendor record
  const [activeModal, setActiveModal] = useState(0);
  // handling active delete modal
  const [activeDeleteModal, setActiveDeleteModal] = useState(0);

  // handle vendor update
  const handleUpdateSuccess = (msg) => {
      success(msg);
      setRefreshAfterAction(prev => !prev);
  }
  const handleUpdateClick = (vendorId) => {
      setActiveModal(parseInt(vendorId));
  }

  // handle vendor deletion
  const handleDeleteSuccess = (msg) => {
      success(msg);
      setRefreshAfterAction(prev => !prev);
  };
  const handleDeleteClick = (vendorId) => {
      setActiveDeleteModal(parseInt(vendorId));
  }

  // reset edit vendor active modal
  const resetEditActiveModal = () => {
      setActiveModal(0);
  }

  // reset delete vendor active modal
  const resetDeleteActiveModal = () => {
      setActiveDeleteModal(0);
  }

  const columns = [
      {
          title: "STT",
          key: "index",
          render: (text, record, index) => index + 1,
      },
      {
          title: "Nhà cung cấp",
          dataIndex: "name",
          key: "name",
      },
      {
          title: "Mã số thuế",
          dataIndex: "taxCode",
          key: "taxCode",
      },
      {
          title: "SĐT",
          dataIndex: "phoneNumber",
          key: "phoneNumber",
      },
      {
          title: "Email",
          dataIndex: "email",
          key: "email",
      },
      {
        title: "Giấy đăng ký kinh doanh",
        dataIndex: "businessLicenseImgName",
        key: "businessLicenseImgName",
        render: (businessLicenseImgName) => {
            return (
              <Image 
                  src={`http://localhost:8080/api/image/vendor/${businessLicenseImgName}`}
                  width={150}
                  height={150}
                  preview={{
                      mask: <span>Xem ảnh</span>
                  }}
                  fallback="http://localhost:8080/api/image/default.png"
              />
            )
        }
      },
      {
        title: "Giấy vệ sinh ATTP",
        dataIndex: "foodSafetyCertImgName",
        key: "foodSafetyCertImgName",
        render: (foodSafetyCertImgName) => {
            return (
              <Image 
                  src={`http://localhost:8080/api/image/vendor/${foodSafetyCertImgName}`}
                  width={150}
                  height={150}
                  preview={{
                      mask: <span>Xem ảnh</span>
                  }}
                  fallback="http://localhost:8080/api/image/default.png"
              />
            )
        }
      },
      {
        title: "Hành động",
        key: "action",
        render: (record) => {
          return (
            <Flex gap="1rem">
              <Button 
                color="blue" 
                variant="solid" 
                onClick={() => handleUpdateClick(record.vendorId)}
                value={record.vendorId}
              >
                  <span style={{fontSize: '1.4rem'}}>Sửa</span>
              </Button>
              {/* <EditVendorModal
                isActive={activeModal === record.vendorId}
                vendorId={record.vendorId}
                resetActiveModal={resetEditActiveModal}
                onUpdateSuccess={handleUpdateSuccess}
              /> */}
              <Button 
                color="red" 
                variant="solid"
                onClick={() => {handleDeleteClick(record.vendorId)}}
              >
                <span value={record.vendorId} style={{fontSize: '1.4rem'}}>Xóa</span>
              </Button>
              {/* <DeleteVendorModal
                isActive={activeDeleteModal === record.vendorId}
                resetActiveModal={resetDeleteActiveModal}
                vendorId={record.vendorId}
                vendorName={record.name}
                onDeleteSuccess={handleDeleteSuccess}
              /> */}
            </Flex>
          )
        },
        align: "center"
      }
  ]

  const fetchVendors = useCallback(async () => {
      try {
            const response = await vendorHTTP.get("/list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: currentPage - 1, // adjust for zero-based index in spring boot
                size: pageSize,
            },
            });

            setData(response.data.content);
            const { content: _, ...rest } = response.data;
            setPageMetadata(rest);
            setLoadingTable(false);
      } catch (error) {
            console.log(error);
            navigate("/login");
      }
  }, [token, currentPage, pageSize, navigate]);

  const searchVendors = useCallback(async() => {
      try {
        const response = await vendorHTTP.get('/search', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                search: searchText ? searchText : '',
                page: currentPage - 1,
                size: pageSize
            }
        });
        if (response.status === 200) {
            setData(response.data.content);
            const {content:_, ...rest} = response.data;
            setPageMetadata(rest);
            setLoadingTable(false);
        }
      }
      catch (error) {
          console.log(error);
      }
  }, [searchText, token, currentPage, pageSize]);

  // side effect for refreshing vendor table
  useEffect(() => {
      if (searchText) {
          searchVendors();
      }
      else {
          fetchVendors();
      }
  }, [refresh, refreshAfterAction, searchText, fetchVendors, searchVendors]);

  return (
    <React.Fragment>
      <Table
          columns={columns}
          dataSource={data.map(vendor => ({...vendor, key: vendor.id}))}
          pagination={false}
      />
    </React.Fragment>
  )
}

export default VendorTable
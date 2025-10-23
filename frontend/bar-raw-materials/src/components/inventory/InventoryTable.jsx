import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useAuthContext } from '../../contexts/AuthContext'
import axiosHTTP from '../../services/ProductInventory'

const InventoryTable = ({
    currentPage,
    pageSize,
    setPageMetadata
  }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthContext();

  // Fetch data from server
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await axiosHTTP.get('/list',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page: currentPage - 1,
                    size: pageSize
                }
            }
        )
        setData(response.data.content);
        const { content: _, ...rest } = response.data;
        setPageMetadata(rest);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [token, currentPage, pageSize]);

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1, // auto index
      align: "center",
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      onCell: () => ({
        style: {
          maxWidth: '20rem',
          whiteSpace: "normal",   // allow wrapping
          wordBreak: "break-word"
        },
      }),
    },
    {
      title: "SL tồn đầu kỳ",
      dataIndex: "startingQuantity",
      key: "startingQuantity",
      align: "right",
    },
    {
      title: "Giá trị tồn đầu kỳ",
      dataIndex: "startingInventory",
      key: "startingInventory",
      align: "right",
      render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    {
      title: "SL nhập trong kỳ",
      dataIndex: "importQuantity",
      key: "importQuantity",
      align: "right",
    },
    {
      title: "Giá trị nhập trong kỳ",
      dataIndex: "importAmount",
      key: "importAmount",
      align: "right",
      render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    {
      title: "SL xuất kho trong kỳ",
      dataIndex: "exportQuantity",
      key: "exportQuantity",
      align: "right",
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "right",
      render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    {
      title: "GVHB",
      dataIndex: "cogs",
      key: "cogs",
      align: "right",
      render: (value) => new Intl.NumberFormat('vn-VN', { style: 'currency', currency: 'VND' }).format(value)
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      bordered
      pagination={false}
    />
  );
};

export default InventoryTable;

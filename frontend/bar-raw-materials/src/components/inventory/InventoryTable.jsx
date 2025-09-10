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
        console.error("Failed to fetch inventory:", error);
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
    },
    {
      title: "SL HTK đầu kỳ",
      dataIndex: "startingQuantity",
      key: "startingQuantity",
      align: "right",
    },
    {
      title: "Giá trị HTK đầu kỳ",
      dataIndex: "startingInventory",
      key: "startingInventory",
      align: "right",
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
    },
    {
      title: "SL xuất kho trong kỳ",
      dataIndex: "exportQuantity",
      key: "exportQuantity",
      align: "right",
    },
    {
      title: "GVHB",
      dataIndex: "cogs",
      key: "cogs",
      align: "right",
    }
  ];

  return (
    <Table
      rowKey="id" // make sure each item has an "id"
      columns={columns}
      dataSource={data}
      loading={loading}
      bordered
      pagination={false}
    />
  );
};

export default InventoryTable;

import React from 'react'
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { 
    DashboardOutlined, 
    DesktopOutlined, 
    AppstoreOutlined, 
    ApartmentOutlined,
    ProductOutlined,
    BankOutlined
} 
from '@ant-design/icons';

const items = [
    {
        key: 'dashboard',
        label: (
            <NavLink to="/">
                <DashboardOutlined />
                <span>Dashboard</span>
            </NavLink>
        ),
    },
    {
        key: 'inventory',
        label: (
            <NavLink to="/menu">
                <AppstoreOutlined />
                <span>Hàng tồn kho</span>
            </NavLink>
        ),
    },
    {
        key: 'category',
        label: (
            <NavLink to="/categories">
                <ApartmentOutlined />
                <span>Danh mục</span>
            </NavLink>
        ),
    },
    {
        key: 'product',
        label: (
            <NavLink to="/products">
                <ProductOutlined />
                <span>Sản phẩm</span>
            </NavLink>
        ),
    },
    {
        key: 'Supplier',
        label: (
            <NavLink to="/supplier">
                <BankOutlined />
                <span>Nhà cung cấp</span>
            </NavLink>
        ),
    },
    {
        key: 'Agency',
        label: (
            <NavLink to="/agency">
                <DesktopOutlined />
                <span>Nhà cung cấp</span>
            </NavLink>
        ),
    },
    {
        key: 'permission',
        label: (
            <NavLink to="/permissions">
                <DesktopOutlined />
                <span>Phân quyền</span>
            </NavLink>
        ),
    },
    {
        key: 'report',
        label: (
            <NavLink to="/reports">
                <DesktopOutlined />
                <span>Thống kê</span>
            </NavLink>
        ),
    },
  ];

const ImsMenu = () => {
    return (
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    )
}

export default ImsMenu
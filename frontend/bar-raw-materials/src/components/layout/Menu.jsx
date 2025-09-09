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
                <span className={"menu-item"}>Dashboard</span>
            </NavLink>
        ),
    },
    {
        key: 'inventory',
        label: (
            <NavLink to="/inventory">
                <AppstoreOutlined />
                <span className={"menu-item"}>Hàng tồn kho</span>
            </NavLink>
        ),
    },
    {
        key: 'category',
        label: (
            <NavLink to="/categories">
                <ApartmentOutlined />
                <span className={"menu-item"}>Danh mục</span>
            </NavLink>
        ),
    },
    {
        key: 'product',
        label: (
            <NavLink to="/products">
                <ProductOutlined />
                <span className={"menu-item"}>Sản phẩm</span>
            </NavLink>
        ),
    },
    {
        key: 'Vendor',
        label: (
            <NavLink to="/vendor">
                <BankOutlined />
                <span className={"menu-item"}>Nhà cung cấp</span>
            </NavLink>
        ),
    },
    {
        key: 'Import',
        label: (
            <NavLink to="/import">
                <BankOutlined />
                <span className={"menu-item"}>Nhập kho</span>
            </NavLink>
        ),
    },
    {
        key: 'Customer',
        label: (
            <NavLink to="/customer">
                <DesktopOutlined />
                <span className={"menu-item"}>Khách hàng</span>
            </NavLink>
        ),
    },
    {
        key: 'permission',
        label: (
            <NavLink to="/permissions">
                <DesktopOutlined />
                <span className={"menu-item"}>Phân quyền</span>
            </NavLink>
        ),
    },
    {
        key: 'report',
        label: (
            <NavLink to="/reports">
                <DesktopOutlined />
                <span className={"menu-item"}>Thống kê</span>
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
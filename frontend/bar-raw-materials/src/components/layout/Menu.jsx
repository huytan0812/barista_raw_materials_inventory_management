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
import { useAuthContext } from '../../contexts/AuthContext';

const ImsMenu = () => {
    const {user} = useAuthContext();

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
            label: "Nhập kho",
            icon: <BankOutlined />,
            children: [ 
                { key: 'grn', 
                label: (
                    <NavLink to="/import">
                        <span className={"menu-item"}>Phiếu nhập kho</span>
                    </NavLink>
                ) },
                { key: 'batch', label: (
                    <NavLink to="/import/batches">
                        <span className={"menu-item"}>Lô hàng</span>
                    </NavLink>
                ) }
            ],
        },
        {
            key: 'Export',
            label: (
                <NavLink to="/export">
                    <BankOutlined />
                    <span className={"menu-item"}>Xuất kho</span>
                </NavLink>
            ),
        },
        {
            key: 'report',
            label: (
                <NavLink to="/reports">
                    <DesktopOutlined />
                    <span className={"menu-item"}>Báo cáo hằng ngày</span>
                </NavLink>
            ),
        },
        user.role === "admin" && {
            key: 'accounts',
            label: (
                <NavLink to="/accounts">
                    <DesktopOutlined />
                    <span className={"menu-item"}>Quản lý tài khoản</span>
                </NavLink>
            ),
        },
        user.role === "admin" && {
            key: 'vat',
            label: (
                <NavLink to="/vat">
                    <DesktopOutlined />
                    <span className={"menu-item"}>Thuế</span>
                </NavLink>
            )
        }
    ];

    return (
        <Menu 
            theme="dark" 
            defaultSelectedKeys={['1']}
            mode="inline"
            items={items} 
        />
    )
}

export default ImsMenu
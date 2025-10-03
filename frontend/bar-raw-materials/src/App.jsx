import {useEffect} from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'

import MainLayout from './layouts/MainLayout'
import Category from './pages/Category'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Login from './pages/Login'
import Product from './pages/Product'
import Vendor from './pages/Vendor'
import MainImportPage from './pages/MainImportPage.jsx'
import Import from './pages/import/Import.jsx'
import AddGrn from './pages/import/AddGrn.jsx'
import AddGrnItems from './pages/import/AddGrnItems.jsx'
import VerifiedGrn from './pages/import/VerifiedGrn.jsx'
import MainExportPage from './pages/MainExportPage.jsx'
import Export from './pages/export/Export.jsx'
import AddSalesOrder from './pages/export/AddSalesOrder.jsx'
import AddSalesOrderItems from './pages/export/AddSalesOrderItems.jsx'
import SalesOrderDetails from './pages/export/SalesOrderDetails.jsx'
import Customer from './pages/Customer'
import Accounts from './pages/Accounts.jsx'
import Report from './pages/Report'
import UserDetails from './pages/UserDetails.jsx'
import MainReportPage from './pages/MainReportPage.jsx'
import ReportDetails from './pages/reports/ReportDetails.jsx'
import VAT from './pages/VAT.jsx'
import { useAuthContext } from './contexts/AuthContext.jsx'

function App() {
  const { token, verifyJWT } = useAuthContext();

  useEffect(() => {
    if (token) {
      verifyJWT();
    }
  }, [token, verifyJWT]);

  return (
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/' element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/categories' element={<Category /> } />
        <Route path='/products' element={<Product /> } />
        <Route path='/vendor' element={<Vendor /> } />
        <Route path='/import' element={<MainImportPage /> }>
          <Route index element={<Import />} />
          <Route path='/import/add_grn' element={<AddGrn />} />
          <Route path='/import/add_grn/:grnId/add_grn_item' element={<AddGrnItems />} />
          <Route path='/import/grn/:grnId' element={<VerifiedGrn />} />
        </Route>
        <Route path='/export' element={<MainExportPage /> }>
          <Route index element={<Export />} />
          <Route path='/export/add_sales_order' element={<AddSalesOrder />} />
          <Route path='/export/add_sales_order/:salesOrderId/add_item' element={<AddSalesOrderItems />} />
          <Route path='/export/salesOrder/:salesOrderId' element={<SalesOrderDetails />} />
        </Route>
        <Route path='/customer' element={<Customer /> } />
        <Route path='/accounts' element={<Accounts /> } />
        <Route path='/reports' element={<MainReportPage />} >
          <Route index element={<Report /> } />
          <Route path='/reports/:reportId' element={<ReportDetails />} />
        </Route>
        <Route path='/userDetails' element={<UserDetails />} />
        <Route path='/vat' element={<VAT />} />
      </Route>
    </Routes>
  )
}

export default App

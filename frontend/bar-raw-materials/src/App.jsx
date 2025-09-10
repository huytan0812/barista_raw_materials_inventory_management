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
import Customer from './pages/Customer'
import Permission from './pages/Permission'
import Report from './pages/Report'
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
        </Route>
        <Route path='/customer' element={<Customer /> } />
        <Route path='/permissions' element={<Permission /> } />
        <Route path='/reports' element={<Report /> } />
      </Route>
    </Routes>
  )
}

export default App

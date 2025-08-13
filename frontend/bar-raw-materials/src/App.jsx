import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import Category from './pages/Category'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Login from './pages/Login'
import Product from './pages/Product'
import Vendor from './pages/Vendor'
import Customer from './pages/Customer'
import Permission from './pages/Permission'
import Report from './pages/Report'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path='/menu' element={<Inventory />} />
        <Route path='/categories' element={<Category /> } />
        <Route path='/products' element={<Product /> } />
        <Route path='/vendor' element={<Vendor /> } />
        <Route path='/customer' element={<Customer /> } />
        <Route path='/permissions' element={<Permission /> } />
        <Route path='/reports' element={<Report /> } />
      </Route>
    </Routes>
  )
}

export default App

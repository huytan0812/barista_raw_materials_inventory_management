import React from 'react'
import {Outlet} from 'react-router-dom'

const MainExportPage = () => {
  return (
    <React.Fragment>
        <Outlet />
    </React.Fragment>
  )
}

export default MainExportPage
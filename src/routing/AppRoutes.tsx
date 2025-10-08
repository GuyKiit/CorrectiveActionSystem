
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from '../App'
import { AuthPage } from '../auth/AuthPage'
import { ProtectedRoute } from './ProtectedRoute'
import Report from '../pages/Report'
import Home from '../pages/Home'
import PageComplaint from '../pages/Complaint/PageComplaint'
import DepartmentSetting from '../pages/DepartmentSetting'


/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { BASE_URL } = import.meta.env

export default function AppRoutes() {
  
  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          {/* Public routes */}
          <Route path='auth/*' element={<AuthPage />} />
          <Route path='*' element={<Navigate to='/auth' />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path='home' element={<Home />} /> */}
            <Route path='complaint' element={<PageComplaint/>} />
            <Route path='report' element={<Report/>} />
            <Route path='departmentsetting' element={<DepartmentSetting/>} />
            {/* <Route path='profile' element={<div>Profile</div>} /> */}
            {/* <Route path='users/list' element={<div>Users list</div>} />
            <Route path='users/roles' element={<div>Users roles</div>} />
            <Route path='reports/sales' element={<div>Reports sales</div>} />
            <Route path='reports/analytics' element={<div>Reports analytics</div>} /> */}
            {/* Redirect from dashboard to home */}
            <Route path='' element={<Navigate to='/home' />} />
          </Route>

          {/* Redirect unmatched routes */}
          <Route path='/' element={<Navigate to='/home' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

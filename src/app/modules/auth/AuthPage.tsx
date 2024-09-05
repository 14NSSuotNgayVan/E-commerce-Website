import { Navigate, Route, Routes } from 'react-router-dom'
import { Registration } from './components/Registration'
import { ForgotPassword } from './components/ForgotPassword'
import { Login } from './components/Login'
import { AuthLayout } from './AuthLayout'
import { ErrorsPage } from '../errors/ErrorsPage'
import { Verify } from './components/Verify'

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='registration' element={<Registration />} />
      <Route path='login' element={<Login />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route index element={<Navigate to='login' />} />
      <Route path='*' element={<ErrorsPage />} />
      <Route path='verify/:token' element={<Verify />} />
    </Route>
  </Routes>
)

export { AuthPage }

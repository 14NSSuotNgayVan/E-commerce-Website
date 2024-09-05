import { Link, Outlet } from 'react-router-dom'
import "./authLayout.scss"

const AuthLayout = () => {
  return (
    <div className='flex-column flex-middle flex-center authLayout py-10'>
      <div className="d-flex justify-content-center align-items-center">
        <Link className='flex flex-middle flex-center' to={'/home'}>
          <h2 className="text-uppercase text-app-logo-login">angel shop</h2>
        </Link>
      </div>
        <Outlet />
    </div>
  )
}

export { AuthLayout }

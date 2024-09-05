import { FC } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { ErrorsPage } from '../modules/errors/ErrorsPage'
import { Logout, AuthPage, useAuth } from '../modules/auth'
import App from '~/app/App'
import { hasAuthority, hasRole } from '../modules/utils/FunctionUtils'
import { MasterLayout } from '~/_metronic/layout/MasterLayout'
import { PERMISSIONS, PERMISSION_ABILITY, ROLE } from '../constants/Common'
import { ShoppingCart } from '../modules/shopping-cart/ShoppingCart'
import { HomePage } from '../pages/Homepage/HomePage'
import { ProductDetails } from '../modules/product-container/ProductDetails'
import { SearchPage } from '../modules/search-page/SearchPage'
import Supplier from '../modules/suppplier/Supplier'
import Color from '../modules/color/Color'
import Authority from '../modules/authority/Authority'
import Role from '../modules/roles/Role'
import User from '../modules/user/User'
import Category from '../modules/category/Category'
import Customer from '../modules/customer/Customer'
import PaymentMethod from '../modules/payment-method/PaymentMethod'
import Size from '../modules/size/Size'
import Product from '../modules/product/Product'
import Receipt from '../modules/receipt/Receipt'
import Promotion from '../modules/promotion/Promotion'
import { OderInfo } from '../modules/oder-info/OderInfo'
import Address from '../modules/address/Address'
import { UserInfo } from '../modules/UserInfo/UserInfo'
import OrderManager from '../modules/order-manager/OrderManager'
import OrderManagerTab from '../modules/order-manager/OrderManagerTab'
import { About } from '../modules/About/About'
import Report from '../modules/Report/Report'

const { PUBLIC_URL } = process.env
interface PrivateRouteProps {
  auth: string;
  ability: string;
  component: React.ComponentType<any>;
  redirect: string;
}
const AppRoutes: FC = () => {
  const { currentUser } = useAuth()
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ auth, ability, component: Component, redirect, }) => {
    return hasAuthority(auth, ability) ? (<Component />) : (<Navigate to={redirect} />);
  };

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          {!currentUser && <Route path='auth/*' element={<AuthPage />} />}
          <Route element={<MasterLayout />}>
            {currentUser &&
              <>
                <Route path="/auth/*" element={<Navigate to={hasRole([ROLE.USER]) ? "/home" : "/receipt"} />} />
                <Route path="/cart" element={hasRole([ROLE.USER]) ? <PrivateRoute auth={PERMISSIONS.CART} ability={PERMISSION_ABILITY.VIEW} component={ShoppingCart} redirect="/home" /> : <Navigate to={"/home"} />} />
                <Route path="/supplier" element={<PrivateRoute auth={PERMISSIONS.SUPPLIER} ability={PERMISSION_ABILITY.VIEW} component={Supplier} redirect="/home" />} />
                <Route path="/color" element={<PrivateRoute auth={PERMISSIONS.COLOR} ability={PERMISSION_ABILITY.VIEW} component={Color} redirect="/home" />} />
                <Route path="/size" element={<PrivateRoute auth={PERMISSIONS.SIZE} ability={PERMISSION_ABILITY.VIEW} component={Size} redirect="/home" />} />
                <Route path="/authority" element={<PrivateRoute auth={PERMISSIONS.AUTHORITY} ability={PERMISSION_ABILITY.VIEW} component={Authority} redirect="/home" />} />
                <Route path="/roles" element={<PrivateRoute auth={PERMISSIONS.ROLE} ability={PERMISSION_ABILITY.VIEW} component={Role} redirect="/home" />} />
                <Route path="/user" element={hasRole([ROLE.ADMIN, ROLE.MANAGER,ROLE.ROLE_SUPPER_ADMIN]) ? <PrivateRoute auth={PERMISSIONS.USER} ability={PERMISSION_ABILITY.VIEW} component={User} redirect="/home" /> : <Navigate to={"/home"} />} />
                <Route path="/customer" element={<PrivateRoute auth={PERMISSIONS.CUSTOMER} ability={PERMISSION_ABILITY.VIEW} component={Customer} redirect="/home" />} />
                <Route path="/payment-method" element={<PrivateRoute auth={PERMISSIONS.PAYMENT} ability={PERMISSION_ABILITY.VIEW} component={PaymentMethod} redirect="/home" />} />
                <Route path="/receipt" element={<PrivateRoute auth={PERMISSIONS.RECEIPT} ability={PERMISSION_ABILITY.VIEW} component={Receipt} redirect="/home" />} />
                <Route path="/product" element={<PrivateRoute auth={PERMISSIONS.PRODUCT} ability={PERMISSION_ABILITY.VIEW} component={Product} redirect="/home" />} />
                <Route path="/promotion" element={<PrivateRoute auth={PERMISSIONS.PROMOTION} ability={PERMISSION_ABILITY.VIEW} component={Promotion} redirect="/home" />} />
                <Route path="/category" element={<PrivateRoute auth={PERMISSIONS.CATEGORY} ability={PERMISSION_ABILITY.VIEW} component={Category} redirect="/home" />} />
                <Route path="/oder-info" element={hasRole([ROLE.USER]) ? <PrivateRoute auth={PERMISSIONS.ORDER} ability={PERMISSION_ABILITY.VIEW} component={OderInfo} redirect="/home" /> : <Navigate to={"/home"} />} />
                <Route path="/order-manager" element={hasRole([ROLE.ADMIN, ROLE.MANAGER,ROLE.ROLE_SUPPER_ADMIN]) ? <PrivateRoute auth={PERMISSIONS.ORDER} ability={PERMISSION_ABILITY.VIEW} component={OrderManagerTab} redirect="/home" /> : <Navigate to={"/home"} />} />
                <Route path="/user-info" element={<PrivateRoute auth={PERMISSIONS.CUSTOMER} ability={PERMISSION_ABILITY.VIEW} component={UserInfo} redirect="/home" />} />
                <Route path="/delivery-address" element={<PrivateRoute auth={PERMISSIONS.CART} ability={PERMISSION_ABILITY.VIEW} component={Address} redirect="/home" />} />
                <Route path="/report" element={<PrivateRoute auth={PERMISSIONS.REPORT} ability={PERMISSION_ABILITY.VIEW} component={Report} redirect="/home" />} />                
                <Route path="/logout" element={<Logout />} />
              </>}
            <Route index element={<Navigate to="/home" />} />
            <Route path="/home" element={hasRole([ROLE.USER]) || !currentUser ? <HomePage /> : <Navigate to={"/report"} />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/detail/:id" element={<ProductDetails data={[]} />} /> */}
            <Route path="/detail/:id" element={<ProductDetails />} />
            {/* <Route path="/search/:query" element={<SearchPage />} /> */}
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/search/" element={<SearchPage />} />
            <Route path="/search/category/:category" element={<SearchPage />} />
            <Route path='*' element={<ErrorsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }

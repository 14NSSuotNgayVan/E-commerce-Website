import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { KTSVG } from '~/_metronic/helpers';
import { ROLE } from '~/app/constants/Common';
import { useAuth } from '~/app/modules/auth'
import WishListModal from '~/app/modules/component/wishlist/WishListModal';
import { hasRole } from '~/app/modules/utils/FunctionUtils';


const Navbar = (props: any) => {
  const { currentUser } = useAuth()
  const [searchKeyWord, setSearchKeyWord] = useState<string>("")
  
  useEffect(()=>{
    !location.pathname.startsWith('/search') && setSearchKeyWord("")
  },[location.pathname])

  return (
    <>
      {!location.pathname.startsWith('/auth/') &&
        <>{
          (!currentUser || hasRole([ROLE.USER])) &&
          <div className="flex align-items-center col-sm-6 col-lg-5">
            <div className="input-group float-center justify-content-center">
              <div className="form-outline width-100 spaces max-w-400">
                <input type="search" id="form1" className="form-control customs-input" placeholder='' value={searchKeyWord} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyWord(e.target.value)} />
                <label className="form-label bg-white" htmlFor="form1">Tìm kiếm</label>
                <Link to={`/search/${searchKeyWord}`} className="searchTextField">
                  <button type="button" className="btn btn-primary shadow-0 spaces height-100 searchTextField">
                    <i className="fas fa-search"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        }
          <div className="d-flex justify-content-around align-items-center gap-3">
            {currentUser ? 
              <div className="dropdown-menu-hover spaces py-10 mr-10 flex flex-middle">
                <img src={currentUser?.anhDaiDien || '/media/avatars/blank.png'} className="rounded-circle shadow-4 spaces w-30 h-30 mr-10" alt="Avatar" />
                <span className="fs-5">{currentUser?.tenKhachHang || currentUser?.username || ""}</span>
                <div className="dropdown-menu-ul spaces z-index-10 py-10">
                  {hasRole([ROLE.USER]) &&
                    <WishListModal placement="end">
                      {(toggleShow: React.FC) =>
                        <div onClick={toggleShow} className="dropdown-item me-2 icon-hover-primary me-1 rounded fs-5 py-2 px-5 nav-link d-flex align-items-center"> <i className="fas fa-heart m-1 me-md-2"></i><p className="mb-0">Yêu thích</p> </div>
                      }
                    </WishListModal>}
                  {hasRole([ROLE.USER]) && <Link to={"/cart"} className="dropdown-item icon-hover-primary rounded fs-5 py-2 px-5 nav-link d-flex align-items-center"> <i className="fas fa-shopping-cart m-1 me-md-2"></i><p className="mb-0">Giỏ hàng</p> </Link>}
                  {hasRole([ROLE.USER]) && <Link to="/user-info" className="dropdown-item icon-hover-primary me-1 rounded fs-5 py-2 px-5 nav-link d-flex align-items-center"> <i className="fas fa-user-alt m-1 me-md-2"></i><p className="mb-0">Tài khoản</p> </Link>}
                  {currentUser && <Link to="/logout" className="dropdown-item icon-hover-primary me-1 rounded fs-5 py-2 px-5 nav-link d-flex align-items-center"><KTSVG path='/media/icons/arrow-left-from-line.svg' svgClassName='text-muted m-1 me-md-2'></KTSVG><p className="mb-0">Đăng xuất</p> </Link>}
                </div>
              </div> : (
                <>
                  <Link to="/auth" className="icon-hover-primary border rounded fs-5 py-2 px-5 nav-link d-flex align-items-center">
                    <i className="fas fa-shopping-cart m-1 me-md-2"></i>
                    <p className="d-none d-lg-block mb-0">Giỏ hàng</p> 
                  </Link>
                  <Link to="/auth" className="icon-hover-primary border rounded fs-5 py-2 px-5 nav-link d-flex align-items-center">
                    <i className="fas fa-heart m-1 me-md-2"></i>
                    <p className="d-none d-lg-block mb-0">Yêu thích</p>
                  </Link>
                  <Link to="/auth" className="icon-hover-primary me-1 border rounded fs-5 py-2 px-5 nav-link d-flex align-items-center">
                    <i className="fas fa-user-alt m-1 me-md-2"></i>
                    <p className="d-none d-lg-block mb-0">Đăng nhập</p>
                  </Link>
                  <span className="vertical-separator spaces h-36"></span>
                  <Link to="/auth/registration" className="icon-hover-primary me-1 border rounded fs-5 py-2 px-5 nav-link d-flex align-items-center">
                    <i className="fa-solid fa-right-to-bracket m-1 me-md-2"></i>
                    <p className="d-none d-lg-block mb-0">Đăng ký</p>
                  </Link>
                </>
              )
            }
          </div>
        </>
      }
    </>
  )
}

export { Navbar }

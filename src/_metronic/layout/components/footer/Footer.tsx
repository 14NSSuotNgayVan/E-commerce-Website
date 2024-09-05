import { useEffect } from 'react'
import { ILayout, useLayout } from '../../core'

const Footer = () => {
  const { config } = useLayout()
  useEffect(() => {
    updateDOM(config)
  }, [config])
  return (
    <>
      <footer className="text-center text-lg-start text-muted bg-primary mt-3">
        <section className="">
          <div className="container text-center text-md-start pt-4 pb-4">
            <div className="row mt-3">
              <div className="col-12 col-lg-3 col-sm-12 mb-2">
                <p className="mt-1 text-white">
                  @By Dam Van Anh - Nguyen Thien Thang
                </p>
              </div>

              <div className="col-6 col-sm-4 col-lg-2">
                <h6 className="text-uppercase text-white fw-bold mb-2">
                  Cửa hàng
                </h6>
                <ul className="list-unstyled mb-4">
                  <li><a className="text-white-50" href="#">Về chúng tôi</a></li>
                  <li><a className="text-white-50" href="#">Tìm cửa hàng</a></li>
                  <li><a className="text-white-50" href="#">Danh mục</a></li>
                  <li><a className="text-white-50" href="#">Blogs</a></li>
                </ul>
              </div>

              <div className="col-6 col-sm-4 col-lg-2">
                <h6 className="text-uppercase text-white fw-bold mb-2">
                  Thông tin
                </h6>
                <ul className="list-unstyled mb-4">
                  <li><a className="text-white-50" href="#">Trung tâm trợ giúp</a></li>
                  <li><a className="text-white-50" href="#">Hoàn tiền</a></li>
                  <li><a className="text-white-50" href="#">Thông tin vận chuyển</a></li>
                  <li><a className="text-white-50" href="#">Chính sách hoàn trả</a></li>
                </ul>
              </div>

              <div className="col-6 col-sm-4 col-lg-2">
                <h6 className="text-uppercase text-white fw-bold mb-2">
                  Hỗ trợ
                </h6>
                <ul className="list-unstyled mb-4">
                  <li><a className="text-white-50" href="#">Trung tâm trợ giúp</a></li>
                  <li><a className="text-white-50" href="#">Tài liệu</a></li>
                  <li><a className="text-white-50" href="#">Khôi phục tài khoản</a></li>
                  <li><a className="text-white-50" href="#">Đơn hàng của tôi</a></li>
                </ul>
              </div>

              <div className="col-12 col-sm-12 col-lg-3">
                <h6 className="text-uppercase text-white fw-bold mb-2">Bản tin</h6>
                <p className="text-white">Hãy cùng cập nhật thông tin mới nhất về sản phẩm và ưu đãi của chúng tôi</p>
                <div className="input-group mb-3">
                  <input type="email" className="form-control border" placeholder="Email của bạn" aria-label="Email" aria-describedby="button-addon2" />
                  <button className="btn btn-light border shadow-0" type="button" id="button-addon2" data-mdb-ripple-color="dark">
                    Tham gia
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <div className="">
          <div className="container">
            <div className="d-flex justify-content-between py-4 border-top">
              <div>
                <i className="fab fa-lg fa-cc-visa text-white spaces fs-20 mr-4 w-28"></i>
                <i className="fab fa-lg fa-cc-amex text-white spaces fs-20 mr-4 w-28"></i>
                <i className="fab fa-lg fa-cc-mastercard text-white spaces fs-20 mr-4 w-28"></i>
                <i className="fab fa-lg fa-cc-paypal text-white spaces fs-20 mr-4 w-28"></i>
              </div>
            </div>
          </div>
        </div>
      </footer >
    </>
  )
}

const updateDOM = (config: ILayout) => {
  if (config.app?.footer?.fixed?.desktop) {
    document.body.classList.add('data-kt-app-footer-fixed', 'true')
  }

  if (config.app?.footer?.fixed?.mobile) {
    document.body.classList.add('data-kt-app-footer-fixed-mobile', 'true')
  }
}

export { Footer }

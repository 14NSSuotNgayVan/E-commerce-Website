import "./homepage.scss";
import useMultiLanguage from "../../hook/useMultiLanguage";
// import { ProductContainer } from "~/app/modules/product-container/ProductContainer";
import { useEffect, useState, lazy, Suspense } from "react";
import { RESPONSE_STATUS_CODE } from "~/app/constants/Status";
import { IProduct } from "~/app/modules/product/models/ProductModel";
import { searchProduct } from "~/app/modules/product/services/ProductServices";
import { filterObject, formatDateParam } from "~/app/modules/utils/FunctionUtils";
import { toast } from "react-toastify";
import { searchCategory } from "~/app/modules/category/services/CategoryServices";
import { ICategory } from "~/app/modules/category/models/CategoryModel";
import { Link } from "react-router-dom";
import { getReview } from "~/app/modules/services";
import { Rating } from "@mui/material";
import { toAbsoluteUrl } from "~/_metronic/helpers";
import { SEARCH_OBJECT_MAX_SIZE } from "~/app/modules/utils/Constant";

const ProductContainer = lazy(() => import("~/app/modules/product-container/ProductContainer"));

export function HomePage() {
  const { lang } = useMultiLanguage();
  const [data, setData] = useState<IProduct[]>([]);
  const [dataCategory, setDataCategory] = useState<any[]>([]);
  const [dataReview, setDataReview] = useState<any[]>([]);
  const [searchObject, setSearchObject] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });
  document.title = `${lang('SOFTWARE')}`;

  const getCategory = async (searchObject: any = {}) => {
    try {
      const { data } = await searchCategory(filterObject(searchObject));

      if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
        setDataCategory(data?.data?.content);
      }
    } catch (error) {
      toast.error(lang("GENERAL.ERROR"));
    }
  };

  const getDataDetail = async () => {
    try {
      const { data } = await searchProduct(filterObject(SEARCH_OBJECT_MAX_SIZE))
      if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
        setData(data?.data?.content);
      }
    } catch (error) {
      toast.error(lang("GENERAL.ERROR"));
    }
  }

  const getDataReview = async (searchObject: any = {}) => {
    try {
      const { data } = await getReview(filterObject(searchObject));

      if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
        setDataReview(data?.data?.content);
      }
    } catch (error) {
      console.error(lang("GENERAL.ERROR"));
    }
  };

  useEffect(() => {
    getDataDetail();
    getCategory();
    getDataReview({
      pageSize: 10,
      pageIndex: 1,
      soSao: "4,5",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="home-page">
      <nav className="navbar navbar-expand-sm navbar-light bg-white">
        <div className="justify-content-center justify-content-md-between">
          <div className="collapse navbar-collapse" id="navbarLeftAlignExample">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-dark" to={`/search/category/${dataCategory.map((item: ICategory) => item.id).join(",")}`}>Tất cả sản phẩm</Link>
              </li>
              {dataCategory.map((item: ICategory) =>
                <li className="nav-item" key={item.id}>
                  <Link className="nav-link text-dark" to={`/search/category/${item.id}`}>{item.tenLoai}</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="text-white py-5 img-fluid banner" style={{ backgroundImage: `url('media/backgrounds/banner-shoe.jpg')` }}>
        <div className="container py-5">
          <h1 className="fw-500 text-white">
            Thương hiệu & <br />
            Sản phẩm tốt nhẩt ở đây
          </h1>
          <p>
            Sản phẩm ưa thích, Giá cả hợp lý, dịch vụ tốt
          </p>
          <Link to="/about">
            <button type="button" className="btn btn-outline-light spaces mr-8 fw-600 spaces text-uppercase">
              Tìm hiểu thêm
            </button>
          </Link>
          <button type="button" className="btn btn-text-transparent spaces fw-600 text-uppercase">
            Mua hàng ngay
          </button>
        </div>
      </div>
      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductContainer
            data={data}
            xl={4}
            lg={4}
            md={3}
            sm={2}
            display={{
              displayName: "Tất cả sản phẩm"
            }}
          rowDisplay={3}
          />
        </Suspense>
      </section>

      <section className="mt-5 bg-gray">
        <div className="container text-dark pt-3">
          <header className="pt-4 pb-3">
            <h3>Tại sao chọn chúng tôi</h3>
          </header>

          <div className="row mb-4">
            <div className="col-lg-4 col-md-6">
              <figure className="d-flex align-items-center mb-4">
                <span className="rounded-circle bg-white p-3 d-flex me-2 mb-2">
                  <i className="fas fa-camera-retro fa-2x fa-fw text-primary floating"></i>
                </span>
                <figcaption className="info">
                  <h6 className="title">Giá cả phải chăng</h6>
                  <p>Chúng tôi cung cấp sản phẩm với mức giá hợp lý nhất, đảm bảo đáp ứng nhu cầu của mọi khách hàng.</p>
                </figcaption>
              </figure>
            </div>
            <div className="col-lg-4 col-md-6">
              <figure className="d-flex align-items-center mb-4">
                <span className="rounded-circle bg-white p-3 d-flex me-2 mb-2">
                  <i className="fas fa-star fa-2x fa-fw text-primary floating"></i>
                </span>
                <figcaption className="info">
                  <h6 className="title">Chất lượng hàng đầu</h6>
                  <p>Sản phẩm của chúng tôi đều trải qua quy trình kiểm định nghiêm ngặt để đảm bảo chất lượng tốt nhất.</p>
                </figcaption>
              </figure>
            </div>
            <div className="col-lg-4 col-md-6">
              <figure className="d-flex align-items-center mb-4">
                <span className="rounded-circle bg-white p-3 d-flex me-2 mb-2">
                  <i className="fas fa-plane fa-2x fa-fw text-primary floating"></i>
                </span>
                <figcaption className="info">
                  <h6 className="title">Vận chuyển toàn cầu</h6>
                  <p>Chúng tôi cung cấp dịch vụ vận chuyển hàng hóa nhanh chóng và đáng tin cậy đến mọi nơi trên thế giới.</p>
                </figcaption>
              </figure>
            </div>
            <div className="col-lg-4 col-md-6">
              <figure className="d-flex align-items-center mb-4">
                <span className="rounded-circle bg-white p-3 d-flex me-2 mb-2">
                  <i className="fas fa-users fa-2x fa-fw text-primary floating"></i>
                </span>
                <figcaption className="info">
                  <h6 className="title">Sự hài lòng của khách hàng</h6>
                  <p>Sự hài lòng của bạn là niềm tự hào và là động lực để chúng tôi không ngừng cải thiện chất lượng dịch vụ.</p>
                </figcaption>
              </figure>
            </div>
            <div className="col-lg-4 col-md-6">
              <figure className="d-flex align-items-center mb-4">
                <span className="rounded-circle bg-white p-3 d-flex me-2 mb-2">
                  <i className="fas fa-thumbs-up fa-2x fa-fw text-primary floating"></i>
                </span>
                <figcaption className="info">
                  <h6 className="title">Khách hàng hạnh phúc</h6>
                  <p>Phản hồi tích cực từ khách hàng là bằng chứng cho sự cam kết cung cấp dịch vụ và sản phẩm xuất sắc của chúng tôi.</p>
                </figcaption>
              </figure>
            </div>
            <div className="col-lg-4 col-md-6">
              <figure className="d-flex align-items-center mb-4">
                <span className="rounded-circle bg-white p-3 d-flex me-2 mb-2">
                  <i className="fas fa-box fa-2x fa-fw text-primary floating"></i>
                </span>
                <figcaption className="info">
                  <h6 className="title">Hàng ngàn mặt hàng</h6>
                  <p>Với một kho hàng đa dạng và phong phú, chúng tôi tự hào có thể đáp ứng mọi nhu cầu mua sắm của bạn.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-5 mb-4">
        <header className="mb-4">
          <h3>Bình luận nổi bật</h3>
        </header>

        <div className="row overflow-scroll flex-nowrap">
          {dataReview.map((item: any) =>
            <div className="col-lg-3 col-md-6 col-sm-6 col-12" key={item.id}>
              <article>
                <Link to={`/detail/${item?.product?.id}`} className="img-fluid">
                  <img className="img-fluid rounded spaces width-100 h-250 object-fit-cover object-position-center" src={item?.product?.hinhAnh || toAbsoluteUrl("/media/avatars/blank.png")} />
                </Link>
                <div className="mt-2 text-muted small d-block mb-1">
                  <Link to={`/detail/${item?.product?.id}`}><h6 className="text-dark text-ellipsis">{item?.product?.tenSanPham}</h6></Link>
                  <div className="flex mb-2">
                    <img className="rounded-circle shadow-1-strong me-3 flex-shrink-0"
                      src={item?.customer?.anhDaiDien || toAbsoluteUrl("/media/avatars/blank.png")} alt="avatar" width="40"
                      height="40" />
                    <div className="flex-grow-1">
                      <h5 className="mb-0">{item?.customer?.tenKhachHang}</h5>
                      <div className="flex justify-content-between">
                        <span>
                          <i className="fa fa-calendar-alt fa-sm spaces mr-4"></i>
                          {formatDateParam(item?.thoiGian)}
                        </span>
                        <Rating name="half-rating" value={Number(item.soSao) || 0} precision={0.5} readOnly />
                      </div>
                    </div>
                  </div>
                  <p className="line-clamp-3">{item?.noiDung}</p>
                </div>
              </article>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

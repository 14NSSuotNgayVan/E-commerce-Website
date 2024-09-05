import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { RESPONSE_STATUS_CODE, TYPE } from '../../utils/Constant';
import { Rating } from '@mui/material';
import { IProduct } from '../../product/models/ProductModel';
import { getFavourite } from '../../services';
import { convertNumberPriceWithUnit, filterObject, removeFavourite } from '../../utils/FunctionUtils';
import PaginationCustom from '../pagination-custom/Pagination';
import { Link } from 'react-router-dom';
import useMultiLanguage from '~/app/hook/useMultiLanguage';

type WishListModalProps = {
  children: any;
  placement?: 'top' | 'end' | 'bottom' | 'start';
  className?: string
};

const WishListModal: React.FC<WishListModalProps> = ({ children, ...props }) => {
    const { lang } = useMultiLanguage();
    const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IProduct[]>([])
  const [totalPage, setTotalPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [numberOfElements, setNumberOfElements] = useState<number>(0);

  const [searchObject, setSearchObject] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
  });

  const updatePageData = async (searchObject: any = {}) => {
    try {
      setLoading(true);
      const { data } = await getFavourite(filterObject(searchObject));
      setTotalPage(data?.data?.totalPages);
      setTotalElements(data?.data?.totalElements);
      setNumberOfElements(data?.data?.numberOfElements);

      if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
        setData(data?.data?.content?.map((item: any) => item?.product));
      }
    } catch (error) {
      console.error(lang("GENERAL.ERROR"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (data: any = {}) => {
    const searchData = {
      ...searchObject,
      ...data,
    };

    setSearchObject({
      ...searchData,
      pageSize: data?.pageSize,
      pageIndex: data?.pageIndex
    })

    updatePageData({ ...searchData });
  };

  const handleClose = () => setShow(false);

  const toggleShow = () => {
    setShow(true);
    handleSearch();
  };

  return (
    <>
      {(typeof children === TYPE.FUNCTION ? children(toggleShow) : children)}
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sản phẩm yêu thích <i className="fas fa-heart fa-lg px-1 text-primary"></i></Offcanvas.Title>
        </Offcanvas.Header>
        <div className="input-group pb-4 flex-end p-8">
          <div className="form-outline flex-grow-1" data-mdb-input-init>
            <input type="search" id="form1" className="form-control" placeholder='  ' onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchObject({ ...searchObject, keyword: e.target?.value }); }} />
            <label className="form-label bg-white" htmlFor="form1">Tìm kiếm</label>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => handleSearch()} data-mdb-ripple-init >
            {!loading ? <i className="fas fa-search"></i> :
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            }
          </button>
        </div>
        <Offcanvas.Body>
          <div className="col-sm-12">
            {data.length > 0 ? data.map((item: IProduct) =>
              <div className="card shadow-0 border rounded-3">
                <div className="card-body p-sm-3">
                  <div className="row g-0">
                    <div className="col-sm-4 d-flex justify-content-center">
                      <Link to ={`detail/${item.id}`} className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                        <img src={item.hinhAnh} className="w-100" />
                      </Link>
                    </div>
                    <div className="col-sm-8 px-2">
                      <Link to ={`detail/${item.id}`}><h5>{item.tenSanPham}</h5></Link>
                      <div className="d-flex flex-row mb-2">
                        <Rating name="half-rating" value={Number(item.soSaoTB) || 0} precision={0.5} readOnly />
                        <span className="text-muted">{item.tongSoBan} Lượt mua</span>
                      </div>
                      <p className="text mb-4 mb-md-0 line-clamp-3">
                        {item.moTa}
                      </p>
                    </div>
                    <div className="flex align-items-center mt-4  justify-content-between">
                      <div className="d-flex flex-row align-items-center mb-1 col-sm-6">
                        <p className="mb-1 me-1">{convertNumberPriceWithUnit(item.giaKhuyenMai ? item.giaKhuyenMai : item.giaTien)}</p>
                        {item.giaKhuyenMai && <span className="text-danger"><s>{convertNumberPriceWithUnit(item.giaTien)}</s></span>}
                      </div>
                    </div>
                    <div className="col-sm-12 flex justify-content-end">
                      <button className="btn btn-light border px-4 pt-2 icon-hover active" title='Bỏ yêu thích' onClick={() => item?.id && removeFavourite(item?.id,handleSearch)}><i className="fas fa-heart fa-lg px-1"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ) : <p className="text-muted text-center">Bạn không có sản phẩm yêu thích nào</p>}
          </div>
        </Offcanvas.Body>
        <PaginationCustom totalPage={totalPage} pageIndex={searchObject.pageIndex} changePage={(value: number) => handleSearch({ pageIndex: value })} changePerPage={(value: number) => handleSearch({ pageSize: value })} changeRowPerPage={true} totalElements={totalElements} numberOfElements={numberOfElements}/>
      </Offcanvas >
    </>
  );
};

export default WishListModal;

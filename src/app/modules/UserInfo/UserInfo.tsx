import { useContext, useEffect, useState } from "react";
import Address from "../address/Address"
import CollapseMenu from "../search-page/components/CollapseMenu"
import { IOderItem, IOderRes } from "../oder-info/models/oderInfoModels";
import { useAuth } from "../auth";
import AppContext from "~/app/AppContext";
import { checkStatus, convertNumberPriceWithUnit, filterObject, formatDateVN, hasRole } from "../utils/FunctionUtils";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { searchOrder, updateOrder } from "../oder-info/services/OderInfoServices";
import { toast } from "react-toastify";
import { STATUS_ORDER, initOrderRes, oderStatus, paymentStatus } from "../oder-info/constants/oderInfoConstants";
import { Col, Modal, Row } from "react-bootstrap";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import { CommentModal } from "../component/comment/CommentModal";
import { Link } from "react-router-dom";
import { ROLE } from "~/app/constants/Common";
import { updateCustomer } from "../customer/services/CustomerServices";
import { CustomerModal } from "../customer/CustomerModal";
import ImageUpload from "../component/ImageUpload/ImageUpload";

function UserInfo() {
    const { lang } = useMultiLanguage();
    const [dataOder, setDataOder] = useState<IOderRes[]>([]);
    const [oder, setOder] = useState<any>({});
    const { currentUser, setCurrentUser } = useAuth();
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isShowModalCancel, setIsShowModalCancel] = useState<boolean>(false);
    const [isShowReview, setIsShowReview] = useState<boolean>(false);
    const [item, setItem] = useState<any>({});
    const [dataReview, setDataReview] = useState<IOderRes>(initOrderRes);
    const { setPageLoading } = useContext(AppContext);

    const updatePageData = async () => {
        try {
            setPageLoading(true);
            const { data } = await searchOrder(filterObject({
                pageSize: 10,
                pageIndex: 1,
            }));
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataOder(data?.data?.content);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const handleUpdateCustomer = async (anhDaiDien: string) => {
        try {
            setPageLoading(true);
            const { data } = await updateCustomer({
                id: currentUser?.maKhachHang,
                anhDaiDien: anhDaiDien
            });

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                currentUser && setCurrentUser({ ...currentUser, anhDaiDien });
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const handleCancelOder = (data: IOderRes) => {
        setOder({
            id: data.id,
            trangThaiDonHang: oderStatus.biHuy,
            ngayHuyDon: new Date(),
        })
        setIsShowModalCancel(true);
    }

    const handleReceiveOder = (data: IOderRes) => {
        UpdateOderStatus({
            id: data.id,
            trangThaiDonHang: oderStatus.giaoThanhCong,
            trangThaiThanhToan: paymentStatus.daThanhToan
        })
    }

    const UpdateOderStatus = async (dataOder: any) => {
        try {
            setPageLoading(true);
            const { data } = await updateOrder({
                ...dataOder,
            });

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Hủy đơn thành công!");
                updatePageData();
                setIsShowModalCancel(false);
            } else toast.error(data.message);

        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const handleShowModal = () => {
        setIsShowModal(true);
        setItem({
            id: currentUser?.maKhachHang,
            ngaySinh: currentUser?.ngaySinh,
            tenKhachHang: currentUser?.tenKhachHang,
            anhDaiDien: currentUser?.anhDaiDien,
            gioiTinh: currentUser?.gioiTinh,
            username: currentUser?.username
        });
    };

    const handleCloseModal = () => {
        setIsShowModal(false);
        setItem({})
    };

    useEffect(() => {
        hasRole([ROLE.USER]) && updatePageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section style={{ backgroundColor: '#eee' }}>
            <div className="container py-5">
                <div className="row justify-content-around">
                    <div className="col-lg-4">
                        <div className="card mb-4">
                            <div className="card-body text-center">
                                <img src={currentUser?.anhDaiDien || 'media/avatars/blank.png'} alt="avatar"
                                    className="rounded-circle img-fluid spaces w-150 h-150" />
                                <p className="fs-4 my-3">Tên đăng nhập: {currentUser?.username}</p>
                                <h5 className="my-3">{currentUser?.tenKhachHang}</h5>
                                <div className="d-flex justify-content-center mb-2">
                                    {/* <button type="button" className="btn btn-outline-primary ms-1">Đổi ảnh đại diện</button> */}
                                    <ImageUpload handleUploadAvatar={(url: string) => handleUpdateCustomer(url)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {hasRole([ROLE.USER]) &&
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h4 className="flex flex-middle gap-2">Thông tin cá nhân 
                                        <button type="button" className="btn-action" onClick={() => handleShowModal()} >
                                            <i className="fa-solid fa-pen text-primary"></i>
                                        </button>
                                    </h4>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Họ tên khách hàng</p>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="text-muted mb-0">{currentUser?.tenKhachHang}</p>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="text-muted mb-0">{currentUser?.email}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Ngày sinh</p>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="text-muted mb-0">{formatDateVN(currentUser?.ngaySinh || "")}</p>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="mb-0">Giới tính</p>
                                        </div>
                                        <div className="col-sm-3">
                                            <p className="text-muted mb-0">{currentUser?.gioiTinh?.name}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h4 className="mb-0">Địa chỉ nhận hàng</h4>
                                        </div>
                                        <div className="col-sm-9 accordion">
                                            <CollapseMenu defaultActive={true} eventKey="#panelsStayOpen-collapseFour" title="Địa chỉ">
                                                <Address />
                                            </CollapseMenu>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h4 className="">Đơn hàng</h4>
                                    <hr />
                                    {dataOder.length ? 
                                        dataOder.map((item: IOderRes) =>
                                            <div className="card mb-4 border border-1 p-3 shadow-sm">
                                                <div className="row">
                                                    <div className="col-sm-8">
                                                        <div><strong>Mã đơn hàng: {item.id}
                                                        </strong><span className={`ms-2 rounded-pill py-1 px-2 ${checkStatus(STATUS_ORDER, item.trangThaiDonHang?.code)}`}>{item.trangThaiDonHang?.name}</span></div>
                                                        <div className="text-muted">Ngày tạo: {formatDateVN(item.ngayDatHang)}</div>
                                                    </div>
                                                    <div className="col-sm-4 flex justify-content-end align-items-start">
                                                        {(Number(item.trangThaiDonHang?.code) === oderStatus.choThanhToan || Number(item.trangThaiDonHang?.code) === oderStatus.choXuLy) && <button type="button" className="btn btn-outline-danger me-2 btn-sm" onClick={() => handleCancelOder(item)}>Hủy đơn</button>}
                                                        {Number(item.trangThaiDonHang?.code) === oderStatus.DangDuocGiao && <button type="button" className="btn btn-primary btn-sm me-2" onClick={() => handleReceiveOder(item)}>Đã nhận hàng</button>}
                                                        {Number(item.trangThaiDonHang?.code) === oderStatus.giaoThanhCong && <button type="button" className="btn btn-outline-info btn-sm" onClick={() => { setDataReview(item); setIsShowReview(true) }}>Đánh giá</button>}
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                <div className="row">
                                                    <div className="col-sm-4">
                                                        Liên hệ <br />
                                                        <span className="text-muted">{item?.customer.tenKhachHang}</span><br />
                                                        <span className="text-muted">Số điện thoại :</span>{item?.deliveryAddress.soDienThoai}
                                                    </div>
                                                    <div className="col-sm-4">
                                                        Địa chỉ giao hàng<br />
                                                        <span className="text-muted">{item?.deliveryAddress.diaChi}</span>
                                                    </div>
                                                    <div className="col-sm-4">
                                                        Thanh toán<br />
                                                        <span className="text-muted">{item?.payment.tenPhuongThuc}</span><br />
                                                        Tổng giá trị : {convertNumberPriceWithUnit(item.listOrderDetail.reduce((total: any, item: IOderItem) => Number(total) + Number(item.thanhTien), 0))}
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                <div className="row row-gap-1">
                                                    {item.listOrderDetail.map((item: IOderItem) =>
                                                        <div className="col-sm-4">
                                                            <div className="d-flex align-items-center mb-4">
                                                                <div className="me-3 position-relative">
                                                                    <span className="label-floating">
                                                                        {item.soLuong}
                                                                    </span>
                                                                    <img src={item.productDetail.hinhAnh || item.productDetail.product.hinhAnh} className="img-sm rounded border spaces w-80 h-80" />
                                                                </div>
                                                                <div className="col-sm-6 flex-shrink-1">
                                                                    <Link to={`/detail/${item.productDetail.product?.id}`} className="nav-link">
                                                                        <span className="text-ellipsis" title={item.productDetail.product?.tenSanPham}>{item.productDetail.product?.tenSanPham}</span>
                                                                        {item.productDetail?.color?.tenMau}, {item.productDetail?.size?.tenKichThuoc}
                                                                    </Link>
                                                                    <div className="price text-muted">Tổng : <small>{convertNumberPriceWithUnit(item?.thanhTien)}</small></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
    
                                                </div>
                                            </div>
                                        ) : <div className="text-center fs-4">Bạn chưa có đơn hàng nào!</div>
                                    }
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
            <Modal
                show={isShowModal}
                centered
                aria-labelledby="example-custom-modal-styling-title"
                onHide={() => setIsShowModalCancel(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title
                        id="example-custom-modal-styling-title"
                        className=""
                    >
                        Bạn xác nhận muốn hủy đơn hàng?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Row className="p-2">
                        <Col sm={12}>
                            <div className="form-outline">
                                <textarea className="form-control" placeholder="Nhập lí do bạn muốn huỷ đơn" value={oder.lyDoHuy} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOder({ ...oder, lyDoHuy: e.target.value })} rows={2}></textarea>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="flex-center">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsShowModalCancel(false)}>{lang("BTN.CANCEL")}</button>
                    <button type="button" className="btn btn-primary" onClick={() => UpdateOderStatus(oder)}>{lang("BTN.CONFIRM")}</button>
                </Modal.Footer>
            </Modal>
            {isShowReview && <CommentModal isShowModal={isShowReview} handleClose={() => setIsShowReview(false)} dataItem={dataReview} updatePageData={updatePageData} />}
            {isShowModal && <CustomerModal isShowModal={isShowModal} handleCloseModal={handleCloseModal} isInfo
                handleSearch={(data: any) => {
                    if (currentUser) {
                        currentUser.anhDaiDien = data.anhDaiDien;
                        currentUser.gioiTinh = data.gioiTinh;
                        currentUser.tenKhachHang = data.tenKhachHang;
                    }
                    setCurrentUser(currentUser)
                }} item={item} />
            }
        </section >
    )
}
export { UserInfo }
import { useContext, useEffect, useState } from "react";
import { IOderInfo } from "./models/oderInfoModels";
import { ICartItem } from "../shopping-cart/models/ShoppingCartModels";
import Address from "../address/Address";
import { IAddress } from "../address/models/AddressModel";
import CollapseMenu from "../search-page/components/CollapseMenu";
import { IPaymentMethod } from "../payment-method/models/PaymentMethodModel";
import AppContext from "~/app/AppContext";
import { searchPaymentMethod } from "../payment-method/services/PaymentMethodServices";
import { convertNumberPriceWithUnit, filterObject } from "../utils/FunctionUtils";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { toast } from "react-toastify";
import { initOderInfo, oderStatus, paymentMethod, paymentStatus } from "./constants/oderInfoConstants";
import { addOrder } from "./services/OderInfoServices";
import { deleteCart } from "../shopping-cart/services/ShoppingCartServices";
import { useNavigate } from "react-router-dom";
import useMultiLanguage from "~/app/hook/useMultiLanguage";

interface IProps {
    handleback: () => void,
    dataProduct: ICartItem[],
    total: number,
    isFromCart?: boolean,
}

function OderInfo(props: IProps) {
    const { lang } = useMultiLanguage();
    const { handleback, dataProduct, total, isFromCart } = props;
    const [dataOder, setDataOder] = useState<IOderInfo>(initOderInfo);
    const { setPageLoading } = useContext(AppContext);
    const [dataPaymentMethod, setDataPaymentMethod] = useState<IPaymentMethod[]>([])
    const [maPhuongThucThanhToan, setMaPhuongThucThanhToan] = useState<number>();
    const navigate = useNavigate();
    
    const getDataPaymentMethod = async () => {
        try {
            setPageLoading(true);
            const { data } = await searchPaymentMethod(filterObject({
                pageSize: 10,
                pageIndex: 1,
            }));
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataPaymentMethod(data?.data?.content);
                setMaPhuongThucThanhToan(data?.data?.content?.[0]?.id)
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const handleDeleteCartItem = async (ids: string) => {
        try {
            setPageLoading(true);
            deleteCart(ids);
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const handleBuy = async () => {
        try {
            setPageLoading(true);
            const { data } = await addOrder(filterObject({
                ...dataOder,
                ngayDatHang: new Date(),
                maPhuongThucThanhToan: maPhuongThucThanhToan,
                trangThaiDonHang: maPhuongThucThanhToan === paymentMethod.thanhToanKhiNhanHang ? oderStatus.choXuLy : oderStatus.choThanhToan,
                trangThaiThanhToan: paymentStatus.chuaThanhToan,
                listProduct:
                    dataProduct.map((item: ICartItem) => {
                        return {
                            maChiTietSanPham: item.maChiTietSanPham,
                            soLuong: item.soLuong,
                            thanhTien: item.giaBan * item.soLuong
                        }
                    })
            }));
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Đặt hàng thành công");
                isFromCart && handleDeleteCartItem(dataProduct.map((item: ICartItem) => item.id).join(','));
                navigate('/user-info');
            } else toast.error(data.message);
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    useEffect(() => {
        getDataPaymentMethod()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <section className="bg-light py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-8">
                            {/* <!-- Checkout --> */}
                            <div className="card shadow-0 border">
                                <div className="p-4">
                                    <h5 className="card-title mb-3">Thông tin đặt hàng</h5>
                                    <div className="row accordion">
                                        <CollapseMenu defaultActive={true} eventKey="#panelsStayOpen-collapseFour" title="Địa chỉ đặt hàng">
                                            <Address isShowAddress={true} checkedId={dataOder.maDiaChiNhan} handleSetItem={(item: IAddress) => setDataOder({ ...dataOder, maDiaChiNhan: item?.id })} />
                                        </CollapseMenu>
                                    </div>

                                    <hr className="my-4" />

                                    <h5 className="card-title mb-3">Hình thức thanh toán</h5>

                                    <div className="row mb-3">
                                        {dataPaymentMethod.map((item: IPaymentMethod) =>
                                            <div className="col-lg-4 mb-3">
                                                <div className="form-check h-100 border rounded-3">
                                                    <div className="p-3">
                                                        <input className="form-check-input" type="radio" value={item.id} id={`pttt-${item.id}`} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaPhuongThucThanhToan(Number(e.target.value))} checked={Number(item.id) === maPhuongThucThanhToan} />
                                                        <label className="form-check-label" htmlFor={`pttt-${item.id}`}>
                                                            {item.tenPhuongThuc}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <p className="mb-0">Để lại lời nhắn cho người bán</p>
                                        <div className="form-outline">
                                            <textarea className="form-control" id="textAreaExample1" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDataOder({ ...dataOder, ghiChu: e.target.value })} rows={2}></textarea>
                                        </div>
                                    </div>

                                    <div className="float-end">
                                        <button className="btn btn-light border me-3" onClick={handleback}>Quay lại</button>
                                        <button className="btn btn-success shadow-0 border" onClick={handleBuy}>Tiếp tục</button>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Checkout --> */}
                        </div>
                        <div className="col-xl-4 col-lg-4 d-flex justify-content-center justify-content-lg-start">
                            <div className="card shadow-0 border p-4">
                                <h6 className="text-dark my-4">Sản phẩm</h6>
                                <div className="spaces max-h-580 overflow-scroll pt-20">
                                    {dataProduct.map((item: ICartItem) =>
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="me-3 position-relative">
                                                <span className="label-floating">
                                                    {item.soLuong}
                                                </span>
                                                <img src={item.productDetail.hinhAnh || item.productDetail.product.hinhAnh} className="img-sm rounded border spaces w-90 h-90" />
                                            </div>
                                            <div className="">
                                                <a href="#" className="nav-link">
                                                    {item.productDetail.product?.tenSanPham}<br />
                                                    {item.productDetail?.color?.tenMau}, {item.productDetail?.size?.tenKichThuoc}
                                                </a>
                                                <div className="price text-muted">Tổng : {convertNumberPriceWithUnit(item.giaBan * item.soLuong)}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <hr />
                                <h6 className="mb-3">Tổng kết</h6>
                                <div className="d-flex justify-content-between">
                                    <p className="mb-2">Tổng giá:</p>
                                    <p className="mb-2">{convertNumberPriceWithUnit(total)}</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <p className="mb-2">Tổng thành tiền:</p>
                                    <p className="mb-2 fw-bold">{convertNumberPriceWithUnit(total)}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export { OderInfo };
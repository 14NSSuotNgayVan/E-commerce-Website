import { initAddress } from "../../address/consts/AddressConst"
import { initCustomer } from "../../customer/consts/CustomerConst"
import { initPaymentMethod } from "../../payment-method/consts/PaymentMethodConst"
import { initProductDetail } from "../../product-detail/consts/ProductDetailConst"
import { IOderInfo, IOderItem, IOderRes } from "../models/oderInfoModels"

export const initOderInfo: IOderInfo = {
    maDiaChiNhan: "",
    maPhuongThucThanhToan: 0,
    ghiChu: "",
    ngayDatHang: "",
    trangThaiDonHang: 0,
    trangThaiThanhToan: 0,
    listProduct: [],
}
export const initOrderRes: IOderRes = {
    trangThaiDonHang: null,
    trangThaiThanhToan: null,
    id: "",
    maKhachHang: "",
    maDiaChiNhan: "",
    maPhuongThucThanhToan: 0,
    tongSoLuong: 0,
    tongGiaTien: 0,
    ghiChu: "",
    ngayDatHang: "",
    ngayHuyDon: "",
    lyDoHuy: "",
    customer: initCustomer,
    deliveryAddress: initAddress,
    payment: initPaymentMethod,
    listOrderDetail: [],
    listReview: []
}
export const initOderItem: IOderItem = {
    maDonHang: "",
    maChiTietSanPham: "",
    soLuong: 0,
    thanhTien: 0,
    productDetail: initProductDetail
}

export const oderStatus = {
    choThanhToan: 1,
    choXuLy: 2,
    chuanBiHang: 3,
    DangDuocGiao: 4,
    giaoThanhCong: 5,
    biHuy: 6,
}

export const paymentMethod = {
    thanhToanBangThe: 2,
    thanhToanKhiNhanHang: 1
}

export const paymentStatus = {
    chuaThanhToan: 1,
    daThanhToan: 2,
}

export const STATUS_ORDER = [
    { code: 1, name: "Đang chờ thanh toán", styleClass: "bg-dark text-white" },
    { code: 2, name: "Đang chờ xử lý", styleClass: "bg-secondary text-dark" },
    { code: 3, name: "Shop đang chuẩn bị hàng", styleClass: "bg-info text-white" },
    { code: 4, name: "Đơn hàng đang được giao", styleClass: "bg-primary text-white" },
    { code: 5, name: "Giao hàng thành công", styleClass: "bg-success text-white" },
    { code: 6, name: "Đơn hàng đã bị hủy", styleClass: "bg-light text-dark" },
];

const STATUS_PAYMENT = [
    { code: 1, name: "Chưa thanh toán" },
    { code: 2, name: "Đã thanh toán" }
];
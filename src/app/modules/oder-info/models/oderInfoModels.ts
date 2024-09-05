import { IAddress } from "../../address/models/AddressModel";
import { IReview } from "../../component/comment/CommentConstants";
import { ICustomer } from "../../customer/models/CustomerModel";
import { IPaymentMethod } from "../../payment-method/models/PaymentMethodModel";
import { IProductDetail } from "../../product-detail/models/ProductDetailModel";
import { ICartItem } from "../../shopping-cart/models/ShoppingCartModels";

export interface IOderItem {
    id?: string,
    maDonHang?: string,
    maChiTietSanPham: string,
    soLuong: number,
    thanhTien: number,
    productDetail: IProductDetail
}

export interface IOderInfo {
    id?:string,
    maKhachHang?: string,
    maDiaChiNhan: string,
    maPhuongThucThanhToan: number,
    ghiChu: string,
    ngayDatHang: string,
    ngayHuyDon?:string,
    lyDoHuy?: string,
    trangThaiDonHang: number | { code: number, name: string },
    trangThaiThanhToan: number | { code: number, name: string },
    listProduct: IOderItem[],
}

export interface IOderRes {
    trangThaiDonHang: { code: number, name: string } | null,
    trangThaiThanhToan: { code: number, name: string } | null,
    id: string,
    maKhachHang: string,
    maDiaChiNhan: string,
    maPhuongThucThanhToan: number,
    tongSoLuong: number,
    tongGiaTien: number,
    ghiChu: string,
    ngayDatHang: string,
    ngayHuyDon: string,
    lyDoHuy: string,
    customer: ICustomer,
    deliveryAddress: IAddress,
    payment: IPaymentMethod,
    listOrderDetail: IOderItem[],
    listReview : IReview[]
}
import { IProductDetail } from "../../product-detail/models/ProductDetailModel";

export interface ICartItem {
    id: string,
    maKhachHang?: string,
    maChiTietSanPham: string,
    soLuong: number,
    giaBan: number,
    productDetail: IProductDetail
}
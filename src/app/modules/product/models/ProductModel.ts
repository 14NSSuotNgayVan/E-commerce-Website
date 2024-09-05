import { ICategory } from "../../category/models/CategoryModel";
import { IProductDetail } from "../../product-detail/models/ProductDetailModel";

export interface IProduct {
    id: string;
    category: ICategory | null;
    maLoaiSanPham: string;
    tenSanPham: string;
    hinhAnh: string;
    tongSoBan: number;
    soSaoTB: number;
    soLuotDanhGia: number;
    giaTien: number | null;
    moTa: string;
    giaKhuyenMai?: number;
    listProductDetail?: IProductDetail[];
    isFavourite?: boolean;
}
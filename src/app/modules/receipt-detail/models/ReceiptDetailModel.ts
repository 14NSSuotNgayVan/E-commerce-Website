import { ICategory } from "../../category/models/CategoryModel";
import { IColor } from "../../color/models/ColorModel";
import { IProductDetail } from "../../product-detail/models/ProductDetailModel";
import { IProduct } from "../../product/models/ProductModel";
import { ISize } from "../../size/models/SizeModel";

export interface IReceiptDetail {
    id: string;
    maPhieuNhapKho?: string;
    maChiTietSanPham: string;
    productDetail: IProductDetail | null;
    soLuongNhap: number | null;
    giaNhap: number | null;
    hinhAnh: string;
    product?: IProduct;
}
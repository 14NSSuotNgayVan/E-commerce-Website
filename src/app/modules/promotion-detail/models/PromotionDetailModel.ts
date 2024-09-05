import { ICategory } from "../../category/models/CategoryModel";
import { IColor } from "../../color/models/ColorModel";
import { IProduct } from "../../product/models/ProductModel";
import { ISize } from "../../size/models/SizeModel";

export interface IPromotionDetail {
    id: string;
    maKhuyenMai: string;
    maSanPham: string;
    giaKhuyenMai: number | null;
    product: IProduct | null;
}
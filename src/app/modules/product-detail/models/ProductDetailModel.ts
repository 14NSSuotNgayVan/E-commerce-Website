import { ICategory } from "../../category/models/CategoryModel";
import { IColor } from "../../color/models/ColorModel";
import { IProduct } from "../../product/models/ProductModel";
import { ISize } from "../../size/models/SizeModel";

export interface IProductDetail {
    id: string;
    maSanPham: string;
    color: IColor | null;
    maMau: string;
    size: ISize | null;
    maKichThuoc: string;
    soLuong: number;
    hinhAnh: string;
    product: IProduct
}
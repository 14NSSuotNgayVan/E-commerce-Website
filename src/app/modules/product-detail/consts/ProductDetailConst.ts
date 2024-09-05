import { initProduct } from "../../product/consts/ProductConst";
import { IProductDetail } from "../models/ProductDetailModel";

export const initProductDetail: IProductDetail = {
    id: "",
    maSanPham: "",
    color: null,
    maMau: "",
    size: null,
    soLuong: 0,
    maKichThuoc: "",
    hinhAnh: "",
    product: initProduct
}
import { initProductDetail } from "../../product-detail/consts/ProductDetailConst";
import { ICartItem } from "../models/ShoppingCartModels";

export const initCartItem : ICartItem = {
    id:"",
    maChiTietSanPham:"",
    soLuong:0,
    giaBan:0,
    productDetail : initProductDetail
}
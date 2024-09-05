import { ICustomer } from "../../customer/models/CustomerModel"
import { IProduct } from "../../product/models/ProductModel"

export interface IReview {
    id: string,
    maSanPham: string,
    noiDung: string,
    soSao: number,
    thoiGian: string,
    customer: ICustomer,
    product?: IProduct
}

export const initReview: IReview = {
    id: "",
    maSanPham: "",
    noiDung: "",
    soSao: 0,
    thoiGian: "",
    customer: {
        id: "",
        username: "",
        ngaySinh: "",
        tenKhachHang: "",
        anhDaiDien: "",
        gioiTinh: null,
    }
}
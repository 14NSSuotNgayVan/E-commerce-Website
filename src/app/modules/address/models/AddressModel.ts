import { ICustomer } from "../../customer/models/CustomerModel";

export interface IAddress {
    id: string;
    maKhachHang?:string,
    tenNguoiNhan:string,
    soDienThoai:string,
    diaChi: string,
    customer?:ICustomer,
    province?: any;
    district?: any;
    ward?: any;
    numberHouse?: string;
}
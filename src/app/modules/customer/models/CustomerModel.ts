import { IUser } from "../../user/models/UserModel";

export interface ICustomer {
    id: string;
    username: string;
    ngaySinh: string;
    gioiTinh: null | { code: number, name: string };
    tenKhachHang: string;
    anhDaiDien: string;
}
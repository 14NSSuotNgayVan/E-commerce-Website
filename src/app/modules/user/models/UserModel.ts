import { IRole } from "../../roles/models/RoleModel";

export interface IUser {
    id?: string;
    username: string,
    email: string,
    password?: string,
    confirmPassword?: string,
    role: IRole | null,
    maKhachHang?: string;
    tenKhachHang?: string;
    ngaySinh?: string;
    gioiTinh?: { code: number; name: string };
    anhDaiDien?: string;
    verified?: boolean;
}
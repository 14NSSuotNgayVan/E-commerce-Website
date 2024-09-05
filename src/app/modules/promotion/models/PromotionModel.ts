import { ICategory } from "../../category/models/CategoryModel";

export interface IPromotion {
    id: string;
    tenKhuyenMai :string;
    ngayBatDau :string;
    ngayKetThuc :string;
    trangThai : number | null;
}
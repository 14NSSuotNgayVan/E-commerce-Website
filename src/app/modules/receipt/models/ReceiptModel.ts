import { ICategory } from "../../category/models/CategoryModel";
import { ISupplier } from "../../suppplier/models/SupplierModel";

export interface IReceipt {
    id: string;
    maNhaCungCap :string;
    supplier : ISupplier | null;
    tenPhieu :string;
    ngayNhap : string;
    ghiChu:string;
    xacNhanNhapKho : boolean
}
import { ICategory } from "../../category/models/CategoryModel";

export interface IReport {
    id?: string;
    tenBaoCao: string;
    file :string;
    createdAt: string;
    ketQuaPhanTich:string;
}
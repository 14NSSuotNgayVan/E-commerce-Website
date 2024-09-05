import { IAuthority } from "../../authority/models/AuthorityModel";

export interface IRole {
    id: string;
    name: string
    authorities: IAuthority[];
}
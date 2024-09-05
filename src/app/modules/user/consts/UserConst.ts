import { ROLE } from "~/app/constants/Common";
import { IUser } from "../models/UserModel";

export const initUser: IUser = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: null,
    verified: false
}

export const INITIAL_SEARCH_EMPTY_USER = {
    pageIndex: 1,
    pageSize: 999,
    emptyUser : true,
    role : ROLE.USER
}

export const INITIAL_SEARCH_USER = {
    pageIndex: 1,
    pageSize: 999,
    role : ROLE.USER
}
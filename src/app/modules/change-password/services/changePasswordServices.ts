import axios from "axios";
import { IChangePassword } from "../model/changePasswordModel";
const API_URL = process.env.REACT_APP_API_URL;

export const changePassword = (data: IChangePassword) => {
  const url = API_URL + "/user-organization/change-password";
  return axios.patch(url, data);
};

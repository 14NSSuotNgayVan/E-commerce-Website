import axios from "axios";
import { paramsConfig } from "./modules/utils/ParamsUtils";

const API_PATH = process.env.REACT_APP_API_URL;

export const getEmployeeIdByUserId = (id: any) => {
  const url = `${API_PATH}/employee/get-by-user-id/${id}`;
  return axios.get(url);
};

export const searchByPage = (searchObject: any) => {
  const url = API_PATH + "/employee/page";
  return axios.get(url, paramsConfig(searchObject));
};
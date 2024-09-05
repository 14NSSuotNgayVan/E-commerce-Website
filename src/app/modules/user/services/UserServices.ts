import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchUser = async (searchObject: any = {}) => {
  const url = API_PATH + "/user/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addUser = (data: any) => {
  const url = API_PATH + "/user";
  return axios.post(url, data);
};

export const updateUser = (data: any) => {
  const url = API_PATH + `/user/${data.id}`;
  return axios.put(url, data);
};

export const deleteUser = (ids: string) => {
  const url = API_PATH + `/user/ids?ids=${ids}`;
  return axios.delete(url);
};
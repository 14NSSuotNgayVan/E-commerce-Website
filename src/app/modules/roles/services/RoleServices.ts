import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchRole = async (searchObject: any = {}) => {
  const url = API_PATH + "/role/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addRole = (data: any) => {
  const url = API_PATH + "/role";
  return axios.post(url, data);
};

export const updateRole = (data: any) => {
  const url = API_PATH + `/role/${data.id}`;
  return axios.put(url, data);
};

export const deleteRole = (ids: string) => {
  const url = API_PATH + `/role/ids?ids=${ids}`;
  return axios.delete(url);
};
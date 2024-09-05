import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchCategory = async (searchObject: any = {}) => {
  const url = API_PATH + "/category/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addCategory = (data: any) => {
  const url = API_PATH + "/category";
  return axios.post(url, data);
};

export const updateCategory = (data: any) => {
  const url = API_PATH + `/category/${data.id}`;
  return axios.put(url, data);
};

export const deleteCategory = (ids: string) => {
  const url = API_PATH + `/category/ids?ids=${ids}`;
  return axios.delete(url);
};
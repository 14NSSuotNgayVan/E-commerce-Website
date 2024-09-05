import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchProduct = async (searchObject: any = {}) => {
  const url = API_PATH + "/product/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const getProductById = (data: any) => {
  const url = API_PATH + `/product/${data.id}`;
  return axios.get(url, data);
};

export const addProduct = (data: any) => {
  const url = API_PATH + "/product";
  return axios.post(url, data);
};

export const updateProduct = (data: any) => {
  const url = API_PATH + `/product/${data.id}`;
  return axios.put(url, data);
};

export const deleteProduct = (ids: string) => {
  const url = API_PATH + `/product/ids?ids=${ids}`;
  return axios.delete(url);
};
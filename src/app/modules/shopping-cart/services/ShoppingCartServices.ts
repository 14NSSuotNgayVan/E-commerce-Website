import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchCart = async (searchObject: any = {}) => {
  const url = API_PATH + "/cart/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const getCartById = (data: any) => {
  const url = API_PATH + `/cart/${data.id}`;
  return axios.get(url, data);
};

export const addCart = (data: any) => {
  const url = API_PATH + "/cart";
  return axios.post(url, data);
};

export const updateCart = (data: any) => {
  const url = API_PATH + `/cart/${data.id}`;
  return axios.put(url, data);
};

export const deleteCart = (ids: string) => {
  const url = API_PATH + `/cart/ids?ids=${ids}`;
  return axios.delete(url);
};
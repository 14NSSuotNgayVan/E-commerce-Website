import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchProductDetail = async (searchObject: any = {}) => {
  const url = API_PATH + "/product-detail/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addProductDetail = (data: any) => {
  const url = API_PATH + "/product-detail";
  return axios.post(url, data);
};

export const updateProductDetail = (data: any) => {
  const url = API_PATH + `/product-detail/${data.id}`;
  return axios.put(url, data);
};

export const deleteProductDetail = (ids: string) => {
  const url = API_PATH + `/product-detail/ids?ids=${ids}`;
  return axios.delete(url);
};
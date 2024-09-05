import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchReceiptDetail = (searchObject: any = {}) => {
  const url = API_PATH + "/receipt-detail/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const searchColorDetail = ({ productId, ...searchObject }: any = {}) => {
  const url = API_PATH + `/product-detail/color/${productId}`;
  return axios.get(url, paramsConfig(searchObject));
};

export const searchSizeDetail = ({ productId, ...searchObject }: any = {}) => {
  const url = API_PATH + `/product-detail/size/${productId}`;
  return axios.get(url, paramsConfig(searchObject));
};

export const addReceiptDetail = (data: any) => {
  const url = API_PATH + "/receipt-detail";
  return axios.post(url, data);
};

export const updateReceiptDetail = (data: any) => {
  const url = API_PATH + `/receipt-detail/${data.id}`;
  return axios.put(url, data);
};

export const deleteReceiptDetail = (ids: string) => {
  const url = API_PATH + `/receipt-detail/ids?ids=${ids}`;
  return axios.delete(url);
};
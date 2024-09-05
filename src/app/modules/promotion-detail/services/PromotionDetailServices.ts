import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchPromotionDetail = async (searchObject: any = {}) => {
  const url = API_PATH + "/promotion-detail/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addPromotionDetail = (data: any) => {
  const url = API_PATH + "/promotion-detail";
  return axios.post(url, data);
};

export const updatePromotionDetail = (data: any) => {
  const url = API_PATH + `/promotion-detail/${data.id}`;
  return axios.put(url, data);
};

export const deletePromotionDetail = (ids: string) => {
  const url = API_PATH + `/promotion-detail/ids?ids=${ids}`;
  return axios.delete(url);
};
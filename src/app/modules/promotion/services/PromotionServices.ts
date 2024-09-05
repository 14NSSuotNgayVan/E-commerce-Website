import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchPromotion = async (searchObject: any = {}) => {
  const url = API_PATH + "/promotion/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addPromotion = (data: any) => {
  const url = API_PATH + "/promotion";
  return axios.post(url, data);
};

export const updatePromotion = (data: any) => {
  const url = API_PATH + `/promotion/${data.id}`;
  return axios.put(url, data);
};

export const deletePromotion = (ids: string) => {
  const url = API_PATH + `/promotion/ids?ids=${ids}`;
  return axios.delete(url);
};
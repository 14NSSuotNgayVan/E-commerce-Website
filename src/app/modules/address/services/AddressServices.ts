import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchAddress = async (searchObject: any = {}) => {
  const url = API_PATH + "/delivery-address/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addAddress = (data: any) => {
  const url = API_PATH + "/delivery-address";
  return axios.post(url, data);
};

export const updateAddress = (data: any) => {
  const url = API_PATH + `/delivery-address/${data.id}`;
  return axios.put(url, data);
};

export const deleteAddress = (ids: string) => {
  const url = API_PATH + `/delivery-address/ids?ids=${ids}`;
  return axios.delete(url);
};
import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchCustomer = async (searchObject: any = {}) => {
  const url = API_PATH + "/customer/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addCustomer = (data: any) => {
  const url = API_PATH + "/customer";
  return axios.post(url, data);
};

export const updateCustomer = (data: any) => {
  const url = API_PATH + `/customer/${data.id}`;
  return axios.put(url, data);
};

export const deleteCustomer = (ids: string) => {
  const url = API_PATH + `/customer/ids?ids=${ids}`;
  return axios.delete(url);
};
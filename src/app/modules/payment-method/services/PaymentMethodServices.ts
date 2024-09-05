import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchPaymentMethod = async (searchObject: any = {}) => {
  const url = API_PATH + "/payment-method/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addPaymentMethod = (data: any) => {
  const url = API_PATH + "/payment-method";
  return axios.post(url, data);
};

export const updatePaymentMethod = (data: any) => {
  const url = API_PATH + `/payment-method/${data.id}`;
  return axios.put(url, data);
};

export const deletePaymentMethod = (ids: string) => {
  const url = API_PATH + `/payment-method/ids?ids=${ids}`;
  return axios.delete(url);
};
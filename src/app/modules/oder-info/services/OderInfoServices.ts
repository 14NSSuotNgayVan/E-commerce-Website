import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchOrder = async (searchObject: any = {}) => {
  const url = API_PATH + "/order/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addOrder = (data: any) => {
  const url = API_PATH + "/order";
  return axios.post(url, data);
};

export const updateOrder = (data: any) => {
  const url = API_PATH + `/order/${data.id}`;
  return axios.put(url, data);
};

export const deleteOrder = (ids: string) => {
  const url = API_PATH + `/order/ids?ids=${ids}`;
  return axios.delete(url);
};
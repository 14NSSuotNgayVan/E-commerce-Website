import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchReceipt = async (searchObject: any = {}) => {
  const url = API_PATH + "/receipt/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addReceipt = (data: any) => {
  const url = API_PATH + "/receipt";
  return axios.post(url, data);
};

export const updateReceipt = (data: any) => {
  const url = API_PATH + `/receipt/${data.id}`;
  return axios.put(url, data);
};

export const deleteReceipt = (ids: string) => {
  const url = API_PATH + `/receipt/ids?ids=${ids}`;
  return axios.delete(url);
};
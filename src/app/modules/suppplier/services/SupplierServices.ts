import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchSupplier = async (searchObject: any = {}) => {
  const url = API_PATH + "/supplier/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addSupplier = (data: any) => {
  const url = API_PATH + "/supplier";
  return axios.post(url, data);
};

export const updateSupplier = (data: any) => {
  const url = API_PATH + `/supplier/${data.id}`;
  return axios.put(url, data);
};

export const deleteSupplier = (ids: string) => {
  const url = API_PATH + `/supplier/ids?ids=${ids}`;
  return axios.delete(url);
};
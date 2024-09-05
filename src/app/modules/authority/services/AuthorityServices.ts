import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchAuthority = async (searchObject: any = {}) => {
  const url = API_PATH + "/authority/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addAuthority = (data: any) => {
  const url = API_PATH + "/authority";
  return axios.post(url, data);
};

export const updateAuthority = (data: any) => {
  const url = API_PATH + `/authority/${data.id}`;
  return axios.put(url, data);
};

export const deleteAuthority = (ids: string) => {
  const url = API_PATH + `/authority/ids?ids=${ids}`;
  return axios.delete(url);
};
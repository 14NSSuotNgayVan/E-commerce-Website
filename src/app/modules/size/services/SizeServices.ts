import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchSize = async (searchObject: any = {}) => {
  const url = API_PATH + "/size/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addSize = (data: any) => {
  const url = API_PATH + "/size";
  return axios.post(url, data);
};

export const updateSize = (data: any) => {
  const url = API_PATH + `/size/${data.id}`;
  return axios.put(url, data);
};

export const deleteSize = (ids: string) => {
  const url = API_PATH + `/size/ids?ids=${ids}`;
  return axios.delete(url);
};
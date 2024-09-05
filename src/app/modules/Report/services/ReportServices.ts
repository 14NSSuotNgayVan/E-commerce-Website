import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchReport = async (searchObject: any = {}) => {
  const url = API_PATH + "/report/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addReport = (data: any) => {
  const url = API_PATH + "/report";
  return axios.post(url, data);
};

export const updateReport = (data: any) => {
  const url = API_PATH + `/report/${data.id}`;
  return axios.put(url, data);
};

export const deleteReport = (ids: string) => {
  const url = API_PATH + `/report/ids?ids=${ids}`;
  return axios.delete(url);
};
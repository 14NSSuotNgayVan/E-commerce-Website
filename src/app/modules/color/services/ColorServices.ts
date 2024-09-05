import axios from "axios";
import { paramsConfig } from "../../utils/ParamsUtils";

const API_PATH = process.env.API_URL;

export const searchColor = async (searchObject: any = {}) => {
  const url = API_PATH + "/color/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addColor = (data: any) => {
  const url = API_PATH + "/color";
  return axios.post(url, data);
};

export const updateColor = (data: any) => {
  const url = API_PATH + `/color/${data.id}`;
  return axios.put(url, data);
};

export const deleteColor = (ids: string) => {
  const url = API_PATH + `/color/ids?ids=${ids}`;
  return axios.delete(url);
};
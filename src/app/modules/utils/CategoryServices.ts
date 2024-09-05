import { APIResponse } from "../models/models";
import axios, { AxiosResponse } from "axios";
import { MAX_PAGE_SIZE } from "./PageUtils";
import { paramsConfig } from "./ParamsUtils";
import { DEFAULT_PAGE_INDEX, SEARCH_OBJECT_MAX_SIZE } from "./Constant";
const API_URL = process.env.REACT_APP_API_URL;

export const getListJobPosition = () => {
  const url = `${API_URL}/c-simple-category-attribute-value/page`;
  return axios.get(url);
};

export const getListWorkUnit = () => {
  const config = {
    params: {
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: MAX_PAGE_SIZE,
    },
  };
  const url = `${API_URL}/api/v1/organizations/page`;
  return axios.get(url, config);
};

export const getAllSimpleValue = (type: number) => {
  const url = API_URL + `/c-simple-category-attribute-value/page/?type=${type}`;
  return axios.get(url, paramsConfig(SEARCH_OBJECT_MAX_SIZE));
};

export const getListEmployee = (): Promise<AxiosResponse<APIResponse>> => {
  const config = {
    params: {
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: MAX_PAGE_SIZE,
    },
  };
  const url = `${API_URL}/employee/page`;
  return axios.get(url, config);
};

//new
export const searchAllSimpleValue = (searchObject: any) => {
  const url = API_URL + `/c-simple-category-attribute-value/page`;
  return axios.get(url, paramsConfig(searchObject));
};

export const searchAllEmployee = (searchObject: any) => {
  const url = API_URL + "/employee/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const searchListWorkUnit = (searchObject: any) => {
  const url = `${API_URL}/api/v1/organizations/page`;
  return axios.get(url, paramsConfig(searchObject));
};
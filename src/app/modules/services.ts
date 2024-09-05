import axios from "axios";
import { paramsConfig } from "./utils/ParamsUtils";
const API_URL = process.env.API_URL;

interface IFavourite {
  maSanPham: string;
}

export const getFavourite = async (searchObject: any = {}) => {
  const url = API_URL + "/favourite/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const addFavourite = async (data: IFavourite) => {
  const url = API_URL + "/favourite";
  return axios.post(url, data);
};

export const deleteFavourite = (id: string) => {
  const url = API_URL + `/favourite/product/${id}`;
  return axios.delete(url);
};

export const addReview = async (data: any) => {
  const url = API_URL + "/review";
  return axios.post(url, data);
};

export const getReview = async (searchObject: any = {}) => {
  const url = API_URL + "/review/page";
  return axios.get(url, paramsConfig(searchObject));
};

export const updateReview = (data: any) => {
  const url = API_URL + `/review/${data.id}`;
  return axios.put(url, data);
};

export const deleteReview = (id: string) => {
  const url = API_URL + `/review/${id}`;
  return axios.delete(url);
};

export const addItemToCart = async (data: any) => {
  const url = API_URL + "/cart";
  return axios.post(url, data);
};

export const handleGetDayOfWeek = (day: any, lang: string) => {
  const date = new Date(day);
  const dayOfWeek = date.getDay();
  const daysOfWeek = (lang === 'en')
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const dayName = daysOfWeek[dayOfWeek];
  return dayName;
};

export const handleGetOnlyDay = (day: string) => {
  const dateParts = day.split('-');
  const onlyDay = dateParts[2];
  return onlyDay;
};

export const isSunday = (day: Date) => {
  if (new Date(day).getDay() === 0) {
    return true;
  }
  return false;
};

export const isSaturday = (day: Date) => {
  if (new Date(day).getDay() === 6) {
    return true;
  }
  return false;
};

export const setBackgroundTK = (soCong: number) => {
  if (soCong === 1) {
    return "fulltime";
  } else if (soCong === 0.5) {
    return "parttime";
  } else {
    return "absense";
  }
};
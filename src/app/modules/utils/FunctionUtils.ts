import moment from "moment";
import { toast } from "react-toastify";
import { localStorageItem } from "./LocalStorage";
import { JUST_ALLOW_NUMBER, NUMBER_EXCEPT_THIS_SYMBOLS, RESPONSE_STATUS_CODE, TYPE } from "./Constant";
import { TMenu, TSubMenu, allMenu } from "../../pages/Homepage/listMenu";
import { IItemSearch, OptionReactSelect } from "../models/models";
import { LOCAL_STORAGE_KEY } from "~/app/constants/Common";
import { headerConstant } from "~/_metronic/layout/components/header/header-menus/constant";
import { addFavourite, addItemToCart, deleteFavourite } from "../services";
import { priceUnit, priceUnitDefault } from "../constant";
import { TREE_ADDRESS } from "../AddressDatabase";

interface IPropsExport {
  exportAPI: any;
  fileName?: string;
  setPageLoading?: any
}

export const filterObject = (obj: any) => {
  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      result[key] = value;
    }
  }
  return result;
};

export const checkTypeOf = (value: any) => {
  return Object.prototype.toString.call(value).slice(8, -1);
};

export const covertDateToString = (value: any) => {
  return value ? moment(value).format("YYYY-MM-DD") : "";
};

export function transformArray(arr: any[]) {
  return arr?.map((item) => {
    return {
      code: item?.id,
      name: item?.value,
    };
  });
}

export function transformArrayByName(name: string, arr: any[]) {
  return arr?.map((item) => {
    return {
      value: item?.id,
      name: item[name],
    };
  });
}

export function transformArrayByNameForLocation(name: string, arr: any[]) {
  return arr?.map((item) => {
    return {
      ...item,
      code: item?.id,
      name: item[name],
    };
  });
}

export const getOptionById = (id: string, options: OptionReactSelect[]) => {
  return options.find((option) => option?.id === id);
};

export const balanceElements = (tableClass1: string, tableClass2: string) => {
  const table1Rows = document.querySelectorAll(`.${tableClass1} tbody tr`);
  const table2Rows = document.querySelectorAll(`.${tableClass2} tbody tr`);
  const table1HeaderCells = document.querySelectorAll(`.${tableClass1} th`);
  const table2HeaderCells = document.querySelectorAll(`.${tableClass2} th`);

  for (let i = 0; i < Math.max(table1Rows.length, table1HeaderCells.length); i++) {
    if (i < table1HeaderCells.length) {
      const headerCell1 = table1HeaderCells[i] as HTMLElement;
      const headerCell2 = table2HeaderCells[i] as HTMLElement;
      const maxHeightHeaderCell = Math.max(headerCell1?.offsetHeight, headerCell2?.offsetHeight);
      if (maxHeightHeaderCell < 64) {
        headerCell1.style.height = `${maxHeightHeaderCell}px`;
        headerCell2.style.height = `${maxHeightHeaderCell}px`;
      }
    }
    if (i < table1Rows.length) {
      const row1 = table1Rows[i] as HTMLElement;
      const row2 = table2Rows[i] as HTMLElement;
      const maxHeightRow = Math.max(row1?.offsetHeight, row2?.offsetHeight);
      row1.style.height = `${maxHeightRow}px`;
      row2.style.height = `${maxHeightRow}px`;
    }
  }
};

export const exportToExcel = async (props: IPropsExport) => {
  const { exportAPI, fileName = "Danh sách", setPageLoading } = props;
  try {
    if (setPageLoading) {
      setPageLoading(true);
    }
    const data = await exportAPI();
    if (data.status === RESPONSE_STATUS_CODE.SUCCESS) {
      const url = window.URL.createObjectURL(new Blob([data.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      toast.success("Export thành công");
    } else {
      toast.error("Lỗi hệ thống");
    }
  } catch (error) {
    toast.error("Lỗi hệ thống");
  } finally {
    if (setPageLoading) {
      setPageLoading(false);
    }
  }
};

export const convertArray = (arr: string[]) => {
  const result = [];
  if (arr?.length > 0) {
    for (const item of arr) {
      const obj: any = {
        name: item,
        code: item,
      };
      result.push(obj);
    }
  }
  return result;
};

export const hasAuthority = (permission: string, ability: string, type?: string): boolean => {
  const authoritiesString = localStorage.getItem(headerConstant.AUTHORITIES);
  const authorities = authoritiesString ? JSON.parse(authoritiesString) : {};
  const permissionAndAbility = type === TYPE?.MODULE ? `${permission}_${ability}` : `${permission}.${ability}`;
  return authorities[permissionAndAbility];
};

export const hasRole = (role: string[]): boolean => {
  const UserRole = localStorageItem.get(headerConstant.USER_ROLE) || "";
  return role.includes(UserRole);
};

export const checkInvalidDate = (date: string | number | Date | null) => {
  if (!date) return true;
  const newDate = new Date(date);
  if (1900 > newDate.getFullYear() || newDate.getFullYear() > 9999) {
    return true;
  }
  return isNaN(newDate.getTime());
};

export const handleBlurDate = (setFieldValue: any, date: string | number | Date | null, name: string) => {
  if (checkInvalidDate(date)) {
    setFieldValue(name, null);
    return;
  }
}

const checkInvalidDateMoment: any = (result: string) => {
  const INVALID_DATE = "Invalid date";
  if (result === INVALID_DATE) return false;
  return result;
}

export const formatDateTimeInput = (date: string | Date) => {
  return (
    checkInvalidDateMoment(moment(date).format("YYYY-MM-DD")) ||
    checkInvalidDateMoment(moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")) ||
    checkInvalidDateMoment(moment(date, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD")) ||
    ""
  );
};

export const formatDateVN = (date: string | Date) => {
  return (
    checkInvalidDateMoment(moment(date).format("DD/MM/YYYY")) ||
    checkInvalidDateMoment(moment(date, "DD/MM/YYYY").format("DD/MM/YYYY")) ||
    checkInvalidDateMoment(moment(date, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY")) ||
    ""
  );
};

export const formatDateParam = (date: string) => {
  return date ? moment(date).format("DD/MM/YYYY hh:mm:ss") : null;
};

export const dateVNToDate = (inputDate: string) => {
  if (moment(inputDate, "DD/MM/YYYY", true).isValid() || moment(inputDate, "DD/MM/YYYY HH:mm:ss", true).isValid()) {
    const inputDateSplit = inputDate.trim().split(" ");
    const dateSplit = inputDateSplit[0].split("/");
    const day = Number(dateSplit[0]);
    const month = Number(dateSplit[1]) - 1;
    const year = Number(dateSplit[2]);

    if (inputDateSplit[1]) {
      const timeSplit = inputDateSplit[1].split(":");
      const hour = Number(timeSplit[0]);
      const minute = Number(timeSplit[1]);
      const second = Number(timeSplit[2]);
      return new Date(year, month, day, hour, minute, second);
    }
    return new Date(year, month, day);
  }
  return !checkInvalidDate(inputDate) ? inputDate : "";
}

export const checkObject = (obj: any) => {
  return Object.keys(obj ? obj : {}).length === 0;
};

export const formatDateTable = (date: string | null) => {
  if (!date) return null;
  const newDate = new Date(date);
  return moment(newDate).format("DD/MM/YYYY");
};

export const convertSearch = (data: any[]) => {
  const dataSearch: any = {}
  data.forEach((item: IItemSearch) => {
    if (typeof item.value === TYPE.OBJECT) {
      if (!item.value?.id) {
        dataSearch[item?.field] = item.value?.code;
      } else {
        dataSearch[item?.field] = item.value?.id;
      }
    } else {
      dataSearch[item.field] = item.value || null
    }
  });
  return dataSearch;
}

export const numberExceptThisSymbols = (event: any) => {
  return NUMBER_EXCEPT_THIS_SYMBOLS.includes(event?.key) && event.preventDefault()
}

export const justAllowNumber = (event: any) => {
  return JUST_ALLOW_NUMBER.includes(event?.key) && event.preventDefault();
}

export const removeDiacritics = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const formatDateTime = (date: string) => {
  const newDate = new Date(date)
  return date ? moment(newDate).format("YYYY-MM-DD") : null;
};

export const checkMenuByPermissions = (): TMenu[] => {
  const checkedMenu: TMenu[] = [];
  allMenu.forEach((menu) => {
    const filteredSubMenu: TSubMenu[] = [];
    // if (hasAuthority(menu.permission, menu.ability, TYPE.MODULE)) {
    menu.subMenu.forEach((subMenu) => {
      if (hasAuthority(subMenu.permission, subMenu.ability)) {
        filteredSubMenu.push(subMenu);
      }
    });
    const checkedMenuItems: TMenu = {
      ...menu,
      subMenu: filteredSubMenu,
    };
    checkedMenu.push(checkedMenuItems);
    // }
  });
  return checkedMenu;
  // return allMenu;
};

export const convertTextPrice = (value: string | number) => {
  return String(value).replace(/\D/g, '');
}

export const convertNumberPrice = (value: number | string | null) => {
  const valueNumber = String(value).replace(/\D/g, '');
  const number = Number(valueNumber ? valueNumber : 0);
  const plainNumber = number.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  const valuePrice = plainNumber.substr(0, plainNumber.length - 2)
  return `${valuePrice !== "0" ? valuePrice : ""}`;
};

export const convertNumberPriceWithUnit = (value: number | string | null) => {
  const valueNumber = String(value).replace(/\D/g, '');
  const number = Number(valueNumber ? valueNumber : 0);
  const plainNumber = number.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  const valuePrice = plainNumber.substr(0, plainNumber.length - 2)
  return `${valuePrice !== "0" ? valuePrice : ""} ${priceUnitDefault}`;
};

export const addMoreYear = (currentDate: string | null, quality: number) => {
  if (!currentDate) return null;
  const yearAdd = 365.25 * 24 * 60 * 60 * 1000 * quality;
  const newDate = new Date(new Date(currentDate).getTime() + yearAdd);
  const newYear = newDate.getFullYear();
  const newMonth = newDate.getMonth() + 1;
  const newDay = newDate.getDate();

  return `${newYear}-${String(newMonth).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`;
};

export const addMoreMonth = (currentDateString: string | null, quality: number) => {
  if (!currentDateString) return null;
  const currentDate = new Date(currentDateString);
  currentDate.setMonth(currentDate.getMonth() + quality);
  currentDate.setDate(currentDate.getDate() - 1);

  return currentDate;
};

export const addMoreDay = (currentDate: string | null, quality: number) => {
  if (!currentDate) return null;
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + quality);

  const newYear = newDate.getFullYear();
  const newMonth = newDate.getMonth() + 1;
  const newDay = newDate.getDate();

  return `${newYear}-${String(newMonth).padStart(2, "0")}-${String(newDay).padStart(2, "0")}`;
};

export const getFullYear: (firstYear?: number, lastYear?: number) => OptionReactSelect[] = (
  firstYear = 100,
  lastYear = 100
) => {
  const currentYear = new Date().getFullYear();
  const endYear = currentYear + lastYear;
  const startYear = currentYear - firstYear;

  return Array.from({ length: endYear - startYear + 1 }, (_, index) => ({
    code: (index + 1).toString(),
    name: String(startYear + index)
  }));
}
//Kiểm tra độ sâu của mảng (arr là mảng trong mảng, không hỗ trợ mảng trong object)
export const countArrayDeep = (arr: any[]): number => {
  if (!Array.isArray(arr)) return 0;

  let maxDeep = 1;

  arr.forEach(item => {
    if (Array.isArray(item)) {
      const deep = 1 + countArrayDeep(item);
      maxDeep = Math.max(maxDeep, deep);
    }
  })

  return maxDeep;
}

//Tách các phần tử của mảng theo độ sâu của mảng
export const extractElementsByDepth = (array: any[], level: number = 0, target: any[] = []) => {
  array.forEach((element) => {
    if (Array.isArray(element)) {
      extractElementsByDepth(element, level + 1, target);
    } else {
      target[level] ? target[level].push(element) : (target[level] = [element]);
    }
  });

  return target;
};

//Chuyển đổi số Integer sang số la mã
export const romanize = (num: number): string => {
  if (isNaN(num)) return "NaN";
  const digits = String(+num).split("");
  const key: string[] = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
    "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"
  ];
  let roman = "";
  let i = 3;
  while (i--) roman = (key[+digits.pop()! + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
};

// Lấy quý hiện tại
export const getCurrentQuarter = () => {
  return Math.floor(new Date().getMonth() / 3) + 1;
};

// Tạo ID ngẫu nhiên với độ dài cho trước
export const randomId = function (length: number) {
  return Math.random().toString(36).substring(2, length + 2);
};

export function isXS() {
  if (window) {
    return window.matchMedia(`(max-width: 576px)`).matches;
  }
  return false;
}

export function isSM() {
  if (window) {
    return window.matchMedia(`(max-width: 768px)`).matches;
  }
  return false;
}

export function isMD() {
  if (window) {
    return window.matchMedia(`(max-width: 992px)`).matches;
  }
  return false;
}

export function isLG() {
  if (window) {
    return window.matchMedia(`(max-width: 1200px)`).matches;
  }
  return false;
}

export function isXL() {
  if (window) {
    return window.matchMedia(`(min-width: 1200px)`).matches;
  }
  return false;
}

export function checkScreenSize(xs: any, sm: any, md: any, lg: any, xl: any) {

  if (xs && isXS()) return xs;
  else if (sm && isSM()) return sm;
  else if (md && isMD()) return md;
  else if (lg && isLG()) return lg;
  return xl;
}

export const checkStatus = (listStatus: any[], code: any) => {
  const itemFinded = listStatus ? listStatus.find((item: any) => item?.code === code) : null;
  return itemFinded?.styleClass || "";
};


export const removeFavourite = async (id: string, handleSearch: any) => {
  try {
    const { data } = await deleteFavourite(id);
    if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
      handleSearch();
      toast.success("Bạn đã bỏ yêu thích sản phẩm này thành công");
    }
  } catch (error) {
    toast.error("Sảy ra lỗi, vui lòng thử lại");
  }
}

export const addToFavourite = async (id: string, handleSearch: any) => {
  try {
    const { data } = await addFavourite({ maSanPham: id });
    if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
      handleSearch();
      toast.success("Đã thêm sản phẩm vào yêu thích!");
    }
  } catch (error) {
    toast.error("Sảy ra lỗi, vui lòng thử lại");
  }
}

export const handleToggleFavourite = (id: string, handleSearch: any, isFavourite: boolean | undefined) => {
  isFavourite ? removeFavourite(id, handleSearch) : addToFavourite(id, handleSearch);
}

export const handleAddToCart = async (dataUpdate: any) => {
  try {
    const { data } = await addItemToCart(dataUpdate);
    if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } else toast.error(data.message)
  } catch (error) {
    toast.error("Sảy ra lỗi, vui lòng thử lại");
  }
}

export function removeDuplicates<T>(arr: T[], isEqual: (a: T, b: T) => boolean = isEqualObject): T[] {
  return arr.filter((item, index, self) => {
    return index === self.findIndex((t) => isEqual(item, t));
  });
}

export const isEqualObject = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const getDistrictByProvinceId = (provinceId: string) => {
  const dataProvince: any = TREE_ADDRESS.find((item: any) => item?.code === provinceId);
  return dataProvince?.quan_huyen;
}

export const getWardByDistrictId = (districtList: any[], districtId: string) => {
  const dataDistrict: any = districtList?.find((item: any) => item?.code === districtId);
  return dataDistrict?.xa_phuong || [];
}
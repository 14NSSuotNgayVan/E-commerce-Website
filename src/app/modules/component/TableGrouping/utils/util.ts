import { TYPE } from "../../../utils/Constant";
import { IColumns } from "../TableGrouping";

export const bringChildToParrent = (arr: IColumns[]): any[] => {
  let result: any[] = [...arr];
  arr.forEach((col) => {
    if (col.child) {
      result = result.concat([bringChildToParrent(col.child)]);
    }
  });

  return result;
};

export const filterChild = (listColumn: IColumns[]): any[] => {
  return listColumn.map((col) => (col.child ? filterChild(col.child) : col));
};

export const caculateTotal = (data: any, firstLevelDataField: string, secondLevelDataField: string) => {
  const objTotal: { [key: string]: any } = {};
  data?.[firstLevelDataField]?.forEach((itemFirst: any) => {
    itemFirst?.[secondLevelDataField].forEach((item: any) => {
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === TYPE.NUMBER) {
          objTotal[key] = (objTotal[key] || 0) + value;
        }
      });
    });
  });

  return objTotal;
};

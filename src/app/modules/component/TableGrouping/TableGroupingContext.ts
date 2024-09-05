import { createContext } from "react";
import { IColumns } from "./TableGrouping";

interface ITableGroupingContext {
  columnsConvert: IColumns[];
  rowsPerPage: number;
  page: number;
  handleDoubleClick?: (row: any) => void;
  secondLevelTitleField: string;
  secondLevelDataField: string;
  firstLevelTitleField: string;
  firstLevelDataField: string;
}

const initTableGroupingContext: ITableGroupingContext = {
  columnsConvert: [],
  rowsPerPage: 10,
  page: 1,
  secondLevelTitleField: "",
  secondLevelDataField: "",
  firstLevelTitleField: "",
  firstLevelDataField: ""
};

const TableGroupingContext = createContext(initTableGroupingContext);

export default TableGroupingContext;

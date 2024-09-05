import { CSSProperties, FC } from "react";
import { CustomElementbyTagName } from "./CustomElementbyTagName";
import { SELECTION_MODE } from "../../utils/Constant";
import { CustomTable } from "./CustomTable";

export interface TableProps {
  data: any[];
  columnNameList: columnNamesType[];
  headerClasses?: string;
  bodyClasses?: string;
  name?: string;
  nameParent?: string;
  height?: number;
  scrollable?: boolean;
  nameChildren: string;
  titleComponent?: string;
  setData: (data: any) => void;
  selectData: (data: any) => void;
  selectionMode?: typeof SELECTION_MODE[keyof typeof SELECTION_MODE];
  isSelect?: boolean;
  notDelete?: boolean;
  handleDelete?: (ids: any) => void;
  title?: string;
  buttonAdd?: boolean;
  handleOpenDialog?: () => void;
  noToolbar?: boolean;
  uniquePrefix?: string;
  disabledSelect?: boolean;
  handleDoubleClick?: (row: any) => void;
}

export interface columnNamesType {
  name: string;
  field: string;
  sorting?: boolean,
  headerCellProps?: CSSProperties;
  bodyCellProps?: object;
  render?: (data: any, index: number) => any;
}

const TableCollapseCustom: FC<TableProps> = (props) => {
  const { name, titleComponent } = props;
  const titleComponentType = (titleComponent ? titleComponent : "h1") as keyof JSX.IntrinsicElements
  
  return (
    <div>
      {name && <CustomElementbyTagName tagName={titleComponentType} content={name} />}
      <CustomTable {...props} />
    </div>
  );
};

export default TableCollapseCustom;

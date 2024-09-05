import { useMemo, useState } from "react";
import useMultiLanguage from "../../../hook/useMultiLanguage";
import { handlePagesChange, handleRowsPerPageChange, rowsForPage } from "../../utils/PageUtils";
import { KTSVG } from "../../../../_metronic/helpers";
import { DEFAULT_PAGE_INDEX } from "../../utils/Constant";
import TableHeader from "./header/TableHeader";
import TableBodySingle from "./body/TableBodySingle";
import "./tableGrouping.scss";
import TableBodyCollapse from "./body/TableBodyCollapse";
import { caculateTotal, filterChild } from "./utils/util";
import TableGroupingContext from "./TableGroupingContext";
import RowTotal from "./body/RowTotal";
import { TablePagination } from "../table-custom/TablePagination";

export interface IColumns {
  name: string;
  field: string;
  child?: IColumns[];
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  render?: (row: any, STT: number, index: number, data: any) => any;
}

export interface IColumnsTotal {
  field: string;
  colSpan?: number;
  cellStyle?: React.CSSProperties;
  render?: (data: any) => any;
  isTitle?: boolean;
}

interface IProps {
  columns: IColumns[];
  data: any[];
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  buttonAdd?: boolean;
  buttonExportExcel?: boolean;
  handleExportExcel?: (row: any) => void;
  handleOpenDialog?: (row: any) => void;
  title?: string;
  noPagination?: boolean;
  page?: number;
  isSingleRow?: boolean;
  handleDoubleClick?: (row: any) => void;
  secondLevelTitleField: string;
  secondLevelDataField: string;
  firstLevelTitleField: string;
  firstLevelDataField: string;
  className?: string;
  showTotalRow?: boolean;
  columnsTotal?: IColumnsTotal[];
}

function TableGrouping(props: IProps) {
  const {
    columns,
    data,
    totalElements,
    totalPages,
    numberOfElements,
    buttonAdd,
    buttonExportExcel,
    handleExportExcel,
    handleOpenDialog,
    title,
    noPagination,
    isSingleRow,
    handleDoubleClick,
    secondLevelTitleField,
    secondLevelDataField,
    firstLevelTitleField,
    firstLevelDataField,
    className,
    showTotalRow,
    columnsTotal
  } = props;

  const { lang } = useMultiLanguage();

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(props?.page || DEFAULT_PAGE_INDEX);

  const columnsConvert: IColumns[] = useMemo(() => {
    return filterChild(columns).flat(Infinity);
  }, [columns]);

  const dataContext = {
    page,
    rowsPerPage,
    columnsConvert,
    firstLevelDataField,
    firstLevelTitleField,
    secondLevelDataField,
    secondLevelTitleField,
    handleDoubleClick
  };

  const totalData = () => {
    const total = data?.reduce((acc, item) => {
      const calculatedItem = caculateTotal(item, firstLevelDataField, secondLevelDataField);
      Object.entries(calculatedItem).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    }, {});

    return total || {};
  };

  return (
    <TableGroupingContext.Provider value={dataContext}>
      <div className={className || ""}>
        {(buttonAdd || buttonExportExcel || title) && (
          <div className="d-flex align-items-center flex-space-between spaces mb-10">
            {title && <span className="spaces fs-18 text-header-table fw-600">{title}</span>}
            <div className="spaces p-0 d-flex align-items-center">
              {buttonAdd && (
                <button
                  className="spaces button-primary flex flex-middle mx-16"
                  onClick={handleOpenDialog}
                >
                  <i className="spaces bi bi-plus fs-20 white"></i>
                  <p className="spaces fs-14 m-0 ">{lang("BTN.ADD")}</p>
                </button>
              )}

              {buttonExportExcel && (
                <button
                  className="spaces flex flex-middle table-btn outline mr-16"
                  onClick={handleExportExcel}
                >
                  <KTSVG path="/media/icons/export-excel.svg" /> {lang("BTN.EXPORT")}
                </button>
              )}
            </div>
          </div>
        )}

        <div className={`table-responsive customs-collapse-row m-0 table-group`}>
          <table className="table-row-dashed dataTable table w-100">
            <TableHeader columns={columns} />
            <tbody className="bg-white">
              {data?.length > 0 ? (
                isSingleRow ? (
                  <TableBodySingle
                    columns={columnsConvert}
                    data={data}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleDoubleClick={handleDoubleClick}
                  />
                ) : (
                  <>
                    {data?.map((item, index) => (
                      <TableBodyCollapse
                        data={item}
                        index={index}
                        showTotalRow={showTotalRow}
                        columnsTotal={columnsTotal}
                      />
                    ))}
                    {showTotalRow && (
                      <RowTotal
                        data={totalData()}
                        columnsTotal={columnsTotal || []}
                        dataBase={data}
                      />
                    )}
                  </>
                )
              ) : (
                <tr>
                  <td
                    colSpan={columnsConvert.length}
                    className="text-center border"
                  >
                    {lang("TABLE.DATA.EMPTY")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!noPagination && (
          <TablePagination
            page={page || DEFAULT_PAGE_INDEX}
            setPage={setPage}
            handlePagesChange={handlePagesChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            rowsForPage={rowsForPage}
            rowsPerPage={rowsPerPage || 10}
            setRowsPerPage={setRowsPerPage}
            totalPages={totalPages || 0}
            totalElements={totalElements || 0}
            numberOfElements={numberOfElements || 0}
          />
        )}
      </div>
    </TableGroupingContext.Provider>
  );
}

export default TableGrouping;

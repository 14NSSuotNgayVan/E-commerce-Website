import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { TableRow } from "./TableCollapseRow";
import { TablePagination } from "./TablePagination";
import {
  DEFAULT_PAGE_INDEX,
  handlePagesChange,
  handleRowsPerPageChange,
  rowsForPage
} from "../../utils/PageUtils";
import { Form } from "react-bootstrap";
import { TYPE } from "../../utils/Constant";
import { Col, Row } from "react-bootstrap";
import { ChangeColumnDialog } from "./ChangeColumnDialog";
import { KTSVG } from "../../../../_metronic/helpers";
import useMultiLanguage from "../../../hook/useMultiLanguage";
import ActionTableTab from "./ActionTableTab";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

export interface TableProps {
  id?: string;
  data: any[];
  columns: columnNamesType[];
  headerClasses?: string;
  bodyClasses?: string;
  name?: string;
  height?: number;
  scrollable?: boolean;
  sorting?: boolean;
  noPagination?: boolean;
  fixedColumnsCount?: number;
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
  type?: string;
  updatePageData: (objectSearch: any) => void;
  objectSearch?: any;
  dataChecked?: any[];
  setDataChecked?: (dataChecked: any) => void;
  handleDoubleClick?: (row: any) => void;
  noToolbar?: boolean;
  notDelete?: boolean;
  notEdit?: boolean;
  handleDelete?: (ids: any) => void;
  justFilter?: boolean;
  buttonAdd?: boolean;
  buttonExportExcel?: boolean;
  handleOpenDetailDialog?: (row: any) => void;
  handleOpenDialog?: (row: any) => void;
  handleExportExcel?: (row: any) => void;
  dependencies?: any[];
  className?: string;
  isActionTableTab?: boolean;
  title?: string;
  page?: number;
  rowsPerPage?: number;
  unSelectedAll?: boolean;
  deleteConditional?: IDeleteConditional[];
  formik?: any;
}

type IDeleteConditional = {
  keyPath: string;
  value: any;
};
export interface columnNamesType {
  name: string;
  field: string;
  sorting?: boolean;
  action?: boolean;
  headerStyle?: object;
  cellStyle?: object;
  isVisible?: boolean;
  render?: (
    data: any,
    index: number,
    numericalOrder: number,
    itemList: any,
    formik: any
  ) => any;
}

const TableCustom: FC<TableProps> = React.memo((props) => {
  const {
    data,
    id,
    headerClasses,
    bodyClasses,
    height,
    scrollable,
    totalPages,
    totalElements,
    numberOfElements,
    noPagination,
    fixedColumnsCount,
    updatePageData,
    dataChecked,
    setDataChecked,
    handleDoubleClick,
    type,
    noToolbar,
    notDelete,
    notEdit,
    handleDelete,
    justFilter,
    handleOpenDetailDialog,
    handleOpenDialog,
    buttonAdd,
    buttonExportExcel,
    handleExportExcel,
    dependencies,
    className,
    isActionTableTab,
    unSelectedAll,
    title,
    deleteConditional,
    formik
  } = props;

  const { lang } = useMultiLanguage();
  const [itemList, setItemList] = useState<any>(data || []);
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [isColumnSearch, setIsColumnSearch] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(props?.rowsPerPage || 10);
  const [page, setPage] = useState<number>(props?.page || DEFAULT_PAGE_INDEX);
  const [selectedRows, setSelectedRows] = useState<any[]>(dataChecked || []);
  const [searchKeywordObj, setSearchKeywordObj] = useState<any>({});
  const [shouldOpenConfirmDeleteDialog, setShouldOpenConfirmDeleteDialog] = useState(false);
  const [shouldOpenChangeColumnDialog, setShouldOpenChangeColumnDialog] = useState<boolean>(false);
  const [stickyColumnCount, setStickyColumnCount] = useState<number>(fixedColumnsCount || 0);
  const [fixedColumnsCSS, setFixedColumnsCSS] = useState<string>("");
  const firstUpdate = useRef(true);
  const [visibleColumns, setVisibleColumns] = useState<columnNamesType[]>(
    props.columns.map((column) => ({
      ...column,
      isVisible: true
    }))
  );

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    setVisibleColumns(props.columns.map((column) => ({
      ...column,
      isVisible: true
    })))
  }, [props.columns])

  const [objectSearch, setObjectSearch] = useState<any>({
    ...props?.objectSearch,
    pageIndex: page,
    pageSize: rowsPerPage
  });

  function getNestedValue(obj: any, keyPath: string) {
    const keys = keyPath.split(".");

    for (const key of keys) {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
        obj = obj[key];
      } else {
        return null;
      }
    }
    return obj;
  }

  useEffect(() => {
    if (!unSelectedAll) {
      setSelectedRows([]);
    }

    if (data && data?.length > 0) {
      if (deleteConditional) {
        data?.forEach((item: any) => {
          const isDelete = deleteConditional?.every(
            (conditional: IDeleteConditional) => {
              const value = getNestedValue(item, conditional.keyPath);
              return value === conditional.value;
            }
          );
          item.isDelete = !isDelete;
        });
      }
      setItemList([...data]);
    } else {
      setItemList([]);
      setIsCheckAll(false);
    }
  }, [data]);

  const checkedAll = (listData: any[]) => {
    let dataDelete = [];
    const data = listData.filter((item: any) => item?.isChecked);
    if (deleteConditional) {
      dataDelete = listData.filter((item: any) => !item?.isDelete);
    }
    setIsCheckAll(data?.length === 0 ? false : (deleteConditional ? data?.length === dataDelete.length : data?.length === listData?.length));
  };

  // useEffect(() => {
  //   if (!isColumnSearch) updatePageData({ ...objectSearch });
  //   setSearchKeywordObj({});
  // }, [isColumnSearch]);

  const styles: object = {
    height: height || "auto",
    overflowY: scrollable && "auto"
  };

  const checkBox =
    type === TYPE.MULTILINE && !(props?.columns[0]?.name === TYPE.MULTILINE)
      ? [
        {
          name: TYPE.MULTILINE,
          field: "",
          headerStyle: {
            maxHeight: "20px",
            minWidth: "20px",
            textAlign: "left"
          },
          cellStyle: {
            textAlign: "left",
            paddingLeft: "10px"
          },
          isVisible: true,
          render: (
            rowData: any,
            index: number,
            numericalOrder: number,
            itemList: any
          ) => {
            return rowData.isDelete ? (
              <div></div>
            ) : (
              <Form.Check
                className="checkBox"
                checked={rowData?.isChecked}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleCheckBox(event?.target?.checked, index, itemList)
                }
              />
            );
          }
        }
      ]
      : [];

  const checkRadio =
    type === TYPE.SINGLE && !(props?.columns[0]?.name === TYPE.SINGLE)
      ? [
        {
          name: TYPE.SINGLE,
          field: "",
          headerStyle: {
            maxHeight: "20px",
            minWidth: "20px",
            textAlign: "center"
          },
          cellStyle: {
            textAlign: "center",
            paddingLeft: "10px"
          },
          isVisible: true,
          render: (
            rowData: any,
            index: number,
            numericalOrder: number,
            itemList: any
          ) => {
            return rowData.isDelete ? (
              <div></div>
            ) : (
              <Form.Check
                className="checkRadio"
                name="single"
                type={"radio"}
                checked={rowData?.isChecked || false}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleCheckRadio(event?.target?.checked, index, itemList)
                }
              />
            );
          }
        }
      ]
      : [];

  const columns: columnNamesType[] = [
    ...checkRadio,
    ...checkBox,
    ...visibleColumns
  ].filter((column) => column?.isVisible);

  useEffect(() => {
    if (type && fixedColumnsCount) {
      setStickyColumnCount(fixedColumnsCount + 1);
    } else if (!type && fixedColumnsCount) {
      setStickyColumnCount(fixedColumnsCount);
    } else if (type && !fixedColumnsCount) {
      setStickyColumnCount(1);
    } else {
      setStickyColumnCount(0);
    }
    if (stickyColumnCount) {
      const stickyColumns = document.querySelectorAll(`.sticky-column-${id}`);
      let leftOffset = 0;
      const columnsArray = Array.from(stickyColumns);
      
      columnsArray.forEach((column: any) => {
        column.style.left = leftOffset + "px";
        leftOffset += column.offsetWidth;
      });
    }
  }, [visibleColumns, dependencies, stickyColumnCount]);

  useEffect(() => {
    setFixedColumnsCSS(
      Array.from({ length: stickyColumnCount }, (_, index) => {
        return `
        #${id} td:nth-child(${index + 1}) {
          position: -webkit-sticky;
          position: sticky;
          z-index: 2 !important;
        }
  
        #${id} th:nth-child(${index + 1}) {
          position: -webkit-sticky;
          position: sticky;
          background-color: $color-silver !important  ;
          z-index: 2 !important;
        }
      `;
      }).join("\n")
    );
  }, [dependencies, stickyColumnCount]);

  useEffect(() => {
    const newSearchObject = {
      ...objectSearch,
      pageIndex: page,
      pageSize: rowsPerPage
    }
    setObjectSearch(newSearchObject);
    updatePageData({ ...newSearchObject, ...searchKeywordObj });
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (props?.page) {
      setPage(props?.page);
    }
    if (props?.rowsPerPage) {
      setRowsPerPage(props?.rowsPerPage);
    }
  }, [props?.page, props?.rowsPerPage]);

  // useEffect(() => {
  //   updatePageData({ ...objectSearch, ...searchKeywordObj });
  // }, [objectSearch]);

  const handleChangeValueInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchKeywordObj({
      ...searchKeywordObj,
      [event.target.name]: event.target.value
    });
  };

  const handleCheckBox = (checked: boolean, index: number, listData: any) => {
    listData[index].isChecked = checked;
    setItemList([...listData]);
    let updatedSelectedRows = [...selectedRows];
    const selectedItem = listData[index];
    if (checked) {
      updatedSelectedRows.push(selectedItem);
    } else {
      updatedSelectedRows = updatedSelectedRows.filter(
        (item: any) => item?.id !== selectedItem?.id
      );
    }
    setSelectedRows(updatedSelectedRows);
    setDataChecked && setDataChecked(updatedSelectedRows);
  };

  const handleCheckRadio = (checked: boolean, index: number, listData: any) => {
    listData[index].isChecked = checked;
    listData.map((element: any, indexData: number) => {
      element.isChecked = indexData === index;
      return element;
    });
    setItemList([...listData]);
    setSelectedRows([listData[index]]);
    setDataChecked && setDataChecked([listData[index]]);
  };

  const handleCheckBoxAll = (checked: boolean) => {
    itemList.map((element: any) => {
      element.isChecked = element?.isDelete ? false : checked;
      return element;
    });
    setItemList([...itemList]);

    const updatedSelectedRows = [...selectedRows];
    itemList.forEach((element: any) => {
      const index = updatedSelectedRows?.findIndex(
        (item: any) => item?.id === element?.id
      );
      if (checked && !element?.isDelete && !(index > -1)) {
        updatedSelectedRows.push(element);
        return;
      }

      if (!checked && !element?.isDelete && index > -1) {
        updatedSelectedRows.splice(index, 1);
        return;
      }
    });
    setSelectedRows(updatedSelectedRows);
    setDataChecked && setDataChecked(updatedSelectedRows);
  };

  const handleUnCheckBoxAll = () => {
    itemList.map((element: any) => {
      element.isChecked = false;
      return element;
    });
    setItemList([...itemList]);
    setSelectedRows([]);
    setDataChecked && setDataChecked([]);
  };

  useEffect(() => {
    if (itemList?.length > 0) {
      checkedAll(itemList);
    }
  }, [itemList]);

  useEffect(() => {
    handleRenderStickyColumns();
  }, [columns, id, dependencies])

  const handleRenderStickyColumns = () => {
    const stickyColumns = document.querySelectorAll(
      `.sticky-column-${id}`
    );
    let leftOffset = 0;
    stickyColumns.forEach(function (column) {
      (column as HTMLElement).style.left = leftOffset + "px";
      (column as HTMLElement).style.zIndex = "0";
      leftOffset += (column as HTMLElement).offsetWidth;
    });
  };

  return (
    <div id={id} className={className ? className : ""}>
      <style>{fixedColumnsCSS}</style>
      {
        (isActionTableTab || !justFilter) &&
        <div className="table-toolbar rounded-top">
          {isActionTableTab ? (
            <ActionTableTab
              title={title}
              buttonAdd={buttonAdd}
              buttonExportExcel={buttonExportExcel}
              handleOpenDialog={handleOpenDialog}
              handleExportExcel={handleExportExcel}
              selectedRows={selectedRows}
              handleCheckBoxAll={handleCheckBoxAll}
              notDelete={notDelete}
              setShouldOpenConfirmDeleteDialog={setShouldOpenConfirmDeleteDialog}
            />
          ) : (
            <Row >
              {!justFilter ? (
                <Col xs={10} className="flex spaces my-4">
                  {buttonAdd && (
                    <button
                      className="spaces button-primary flex flex-middle mr-16 h-30 my-8 gap-2"
                      onClick={handleOpenDialog}
                    >
                      <KTSVG  className="spaces fs-20 white flex flex-middle" path="/media/icons/plus.svg" />
                      <p className="spaces fs-14 m-0 ">Thêm mới</p>
                    </button>
                  )}

                  {buttonExportExcel && (
                    <button
                      className="spaces flex flex-middle table-btn outline mr-16 h-30 my-8"
                      onClick={handleExportExcel}
                    >
                      <KTSVG path="/media/icons/export-excel.svg" />{" "}
                      {lang("BTN.EXPORT")}
                    </button>
                  )}

                  {selectedRows?.length > 0 && (
                    <div className="my-8 spaces d-flex align-items-center">
                      <span className="spaces mr-16">
                        {lang("SELECTED")}:
                        <strong className="ps-2">
                          {selectedRows ? selectedRows?.length : 0}
                        </strong>
                      </span>
                      <span
                        className="spaces mr-16 fw-bold text-warning cursor-pointer"
                        onClick={() => handleUnCheckBoxAll()}
                      >
                        {unSelectedAll
                          ? lang("UNSELECTED_ALL")
                          : lang("UNSELECTED")}
                      </span>
                      {!notDelete && (
                        <div
                          className="delete-box cursor-pointer spaces mr-16"
                          onClick={(e) => setShouldOpenConfirmDeleteDialog(true)}
                        >
                          <KTSVG  className="spaces text-danger px-4" path="/media/icons/trash-can.svg" />
                          <span className="fw-bold text-danger">
                            {lang("DELETE")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Col>
              ) : (
                <Col xs={10}></Col>
              )}
              {!noToolbar && (
                <Col xs={2} className="flex-end d-flex gap-4 flex-middle spaces my-4">
                  {/* <i
                 className={clsx("bi bi-funnel toolbar-icon fs-5 text-primary", {
                   "filter-open": isColumnSearch
                 })}
                 onClick={() => {
                   setIsColumnSearch((prevState: boolean) => !prevState);
                 }}
               ></i> */}
                  {!justFilter && (
                    <button
                      className="spaces button-primary-outline h-30"
                      onClick={() => {
                        setShouldOpenChangeColumnDialog(true);
                      }}
                    >
                      <KTSVG
                        path={"/media/svg/icons/filter.svg"}
                        className="svg-icon-filter spaces mr-4"
                      />
                      Bộ lọc
                    </button>
                  )}
                </Col>
              )}
            </Row>
          )}
        </div>
      }

      <div className="table-responsive customs-collapse-row m-0" style={styles}>
        <table
          className="table-row-dashed dataTable table w-100"
          id="kt_table_users"
        >
          <thead
            className={clsx(headerClasses, "position-sticky top-0 z-index-3")}
          >
            <tr className="text-header-table fw-600 fw-bolder text-capitalize-first gs-0 border">
              {columns?.map((column: columnNamesType, index: number) => {
                return (
                  <th
                    key={column?.field + index}
                    className={clsx(
                      `p-table text-center bg-header-table ${index <= stickyColumnCount
                        ? `sticky-column sticky-column-${id}`
                        : ""
                      }`,
                      !column?.headerStyle
                    )}
                    style={column?.headerStyle}
                  >
                    {type && index === 0 ? (
                      <>
                        {type === TYPE.MULTILINE && (
                          <Form.Check
                            className="checkBox"
                            checked={isCheckAll}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleCheckBoxAll(event.target.checked)
                            }
                          />
                        )}
                      </>
                    ) : (
                      <div>
                        <div>{column?.name}</div>
                        {isColumnSearch && (
                          <input
                            onChange={handleChangeValueInput}
                            name={column.field}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" && updatePageData) {
                                updatePageData({
                                  ...objectSearch,
                                  ...searchKeywordObj
                                });
                              }
                            }}
                            className=" input-search form-control mt-2"
                          />
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={clsx(bodyClasses)}>
            {itemList?.length > 0 ? (
              itemList?.map((row: any, index: number) => (
                <tr
                  key={index}
                  className={`
                    border-bottom
                    border
                    ${row.isChecked ? "bg-table-active" : ""}
                  `}
                  onClick={() =>
                    type === TYPE.SINGLE
                      ? handleCheckRadio?.(true, index, itemList)
                      : {}
                  }
                  onDoubleClick={() => {
                    !notEdit && handleDoubleClick && handleDoubleClick(row);
                  }}
                >
                  <TableRow
                    idTable={id}
                    dependencies={dependencies}
                    row={row}
                    index={index}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    columns={columns}
                    itemList={itemList}
                    stickyColumnCount={stickyColumnCount}
                    handleOpenDetailDialog={handleOpenDetailDialog}
                    formik={formik}
                  />
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center border">
                  {lang("TABLE.DATA.EMPTY")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!noPagination && (
        <TablePagination
          page={page}
          setPage={setPage}
          handlePagesChange={handlePagesChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          rowsForPage={rowsForPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages || 0}
          totalElements={totalElements || 0}
          numberOfElements={numberOfElements || 0}
        />
      )}

      {shouldOpenConfirmDeleteDialog && (
        <ConfirmDialog
          show={shouldOpenConfirmDeleteDialog}
          title={lang("DIALOG.CONFIRM.DELETE.TITLE")}
          message={lang("DIALOG.CONFIRM.DELETE.MESSAGE")}
          yes={lang("BTN.CONFIRM")}
          onYesClick={() => {
            const ids = selectedRows?.map((row) => row?.id)?.toString();
            handleDelete && handleDelete(ids);
            setShouldOpenConfirmDeleteDialog(false);
          }}
          cancel={lang("BTN.CANCEL")}
          onCancelClick={() => setShouldOpenConfirmDeleteDialog(false)}
        />
      )}

      {shouldOpenChangeColumnDialog && (
        <ChangeColumnDialog
          columns={visibleColumns}
          handleClose={() => {
            setShouldOpenChangeColumnDialog(false);
          }}
          handleDragColumns={(columns) => setVisibleColumns(columns)}
        />
      )}
    </div>
  );
});

export default TableCustom;

import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { TableRow } from "./TableCollapseRow";
import { SELECTION_MODE } from "../../utils/Constant";
import { Form } from "react-bootstrap";
import useMultiLanguage from "../../../hook/useMultiLanguage";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { TableProps, columnNamesType } from "./TableCollapseCustom";
import ActionTableTab from "../table-custom/ActionTableTab";

export const CustomTable: FC<TableProps> = (props) => {
  const { data, nameChildren, nameParent, headerClasses, bodyClasses, columnNameList, height, scrollable, setData, selectionMode, isSelect, notDelete, handleDelete, title, buttonAdd, handleOpenDialog, noToolbar, uniquePrefix = "id", disabledSelect, handleDoubleClick
  } = props;

  const { lang } = useMultiLanguage();

  const [itemList, setItemList] = useState<any[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [searchObject] = useState<object>({});
  const [dataTable, setDataTable] = useState<any[]>([]);
  const [shouldOpenConfirmDeleteDialog, setShouldOpenConfirmDeleteDialog] = useState<boolean>(false);
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>, item: any, parentIndex: number) => {
    const { checked } = event.target;
    const updatedData = updateCheckedSingle(checked, data, item, parentIndex);
    const updatedItem = updateCheckedSingle(checked, itemList, item, parentIndex);

    setAfterDataChecked(updatedData, updatedItem);
  };

  const handleCheckBoxAll = (event: ChangeEvent<HTMLInputElement>, index: any) => {
    const { checked } = event.target;
    const updatedData = updateCheckedAll(data, checked, index);
    const updatedItem = updateCheckedAll(itemList, checked, index);

    setAfterDataChecked(updatedData, updatedItem);
  };

  const updateCheckedAll = (data: any[], isParentChecked: boolean, rowIndex: any) => {
    return data.map((item, index) => {
      return index === rowIndex ? { ...updateChildren(data[index], isParentChecked), isParentChecked } : item;
    });
  };

  const setAfterDataChecked = (updatedData: any, updatedItemList: any) => {
    setData(updatedData);
    setItemList(updatedItemList);
    setDataList(updatedData);
    checkAllItemChecked(updatedData);

    const checkedItems = getCheckedItems(updatedData);
    props?.selectData(checkedItems);
  };

  const updateCheckedSingle = (isChecked: boolean, data: any[], currentItem: any, parrentIndex: number) => {
    return data.map((row: any, index: number) => {
      if (index === parrentIndex) {
        const updatedDataItem: any[] = (row?.[nameChildren] || []).map((item: any) => ({
          ...item,
          isChecked: currentItem?.[uniquePrefix] === item?.[uniquePrefix] ? isChecked : item.isChecked
        }));

        const isParentChecked = updatedDataItem.every((item: any) => item.isChecked);

        return { ...row, [nameChildren]: updatedDataItem, isParentChecked };
      }
      return row;
    });
  };

  const checkAllItemChecked = useCallback((dataChecked: any[]) => {
    setIsCheckAll(
      dataChecked
        .map((item: any) => item[nameChildren])
        .flat()
        .every((item: any) => item?.isChecked)
    );
  }, [nameChildren]);

  useEffect(() => {
    checkAllItemChecked(data);
  }, [checkAllItemChecked, data]);

  // const updateCheckedStatus = (
  //   data: any[],
  //   currentItem: any,
  //   isChecked: boolean
  // ): any[] => {
  //   return data.map((item) => {
  //     if (item?.[uniquePrefix] === currentItem?.[uniquePrefix]) {
  //       let items = updateChildren(item, isChecked)
  //       return { ...items, isChecked };
  //     } else if (item?.[nameChildren] && item?.[nameChildren].length > 0) {
  //       return {
  //         ...item,
  //         [nameChildren]: updateCheckedStatus(item?.[nameChildren], currentItem, isChecked),
  //       };
  //     }
  //     return item;
  //   });
  // };
  const updateChildren = (items: any, isChecked: boolean) => {
    if (items?.[nameChildren]?.length > 0) {
      items?.[nameChildren]?.forEach((item: any) => {
        item.isChecked = isChecked;
        updateChildren(item, isChecked);
      });
    }
    return items;
  };

  const getCheckedItems = useCallback((data: any[]): any[] => {
    const checkedItems: any[] = [];

    const traverse = (item: any) => {
      if (item.isChecked) {
        checkedItems.push(item);
      }

      if (item?.[nameChildren] && item?.[nameChildren]?.length > 0) {
        item?.[nameChildren]?.forEach((child: any) => traverse(child));
      }
    };

    data && data.forEach((item: any) => traverse(item));
    return checkedItems;
  }, [nameChildren]);

  useEffect(() => {
    if (selectionMode === SELECTION_MODE.SINGLE) {
      setDataTable(dataList);
      const checkedItems = getCheckedItems(dataList);
      props?.selectData(checkedItems[0]);
    } else if (selectionMode === SELECTION_MODE.MULTIPLE) {
      setDataTable(itemList);
      const checkedItems = getCheckedItems(itemList);
      props?.selectData(checkedItems);
    } else {
      setDataTable(data);
    }
  }, [data, dataList, itemList, selectionMode, getCheckedItems, props]);

  const styles: object = {
    height: height,
    overflowY: scrollable && 'auto',
  };

  const checkSearch = useCallback(() => {
    const check = Object.values(searchObject)?.some((value: any) => value);
    return check;
  }, [searchObject]);

  useEffect(() => {
    if (!checkSearch()) {
      setItemList(data);
      setDataList(data);
    }
  }, [data, checkSearch]);

  const listItemService = (item: any) => {
    const newItem = { ...item };
    if (newItem?.[nameChildren]) {
      newItem[nameChildren] = newItem?.[nameChildren]?.map((service: any) => listItemService(service));
    }
    return newItem;
  };

  const handleSingleSelect = (row: any, parentIndex: number) => {
    const checked = row.isChecked;
    if (checked) {
      setDataList(data);
    } else {
      const updatedData = updateCheckedSingle(true, data, row, parentIndex);
      checkAllItemChecked(updatedData);
      setDataList(updatedData);
    }
  };

  const toggleRowSelection = (row: any, parentIndex: number) => {
    const checked = row.isChecked;
    const updatedItem = updateCheckedSingle(!checked, itemList, row, parentIndex);
    checkAllItemChecked(updatedItem);
    setItemList(updatedItem);
  };

  const handleSwitchAllChecked = (data: any[], checkedSwitch: boolean) => {
    return data.map((item) => {
      return { ...updateChildren(item, checkedSwitch), isParentChecked: checkedSwitch };
    });
  };

  const handleUnCheckBoxAll = () => {
    const updatedData = handleSwitchAllChecked(data, false);
    const updatedItem = handleSwitchAllChecked(itemList, false);

    setAfterDataChecked(updatedData, updatedItem);
  };

  const handleCheckAll = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setIsCheckAll(checked);
    const updatedData = handleSwitchAllChecked(data, checked);
    const updatedItem = handleSwitchAllChecked(itemList, checked);

    setAfterDataChecked(updatedData, updatedItem);
  };

  const checkedItem = useMemo(() => {
    return getCheckedItems(itemList);
  }, [getCheckedItems, itemList]);

  return (
    <>
      {!noToolbar && (
        <div className="table-toolbar rounded-top p-3">
          <ActionTableTab
            title={title}
            buttonAdd={buttonAdd}
            buttonExportExcel={false}
            handleCheckBoxAll={handleUnCheckBoxAll}
            selectedRows={checkedItem}
            notDelete={notDelete}
            setShouldOpenConfirmDeleteDialog={setShouldOpenConfirmDeleteDialog}
            handleOpenDialog={handleOpenDialog} />
        </div>
      )}
      <div
        className="table-responsive customs-collapse-row m-0"
        style={styles}
      >
        <table className="dataTable table w-100 p-0 py-2">
          <thead className={clsx(headerClasses, "position-sticky top-0 z-index-0 border")}>
            <tr className="text-white fw-bolder fs-7 text-capitalize-first gs-0 bg-header-table text-black">
              {(isSelect && data?.length > 0) && (
                <th className="cell-action cell-action position-sticky start-0 bg-header-table">
                  <Form.Check
                    className="checkBox"
                    checked={isCheckAll}
                    onChange={(event) => !disabledSelect && handleCheckAll(event)}
                    disabled={disabledSelect} />
                </th>
              )}
              {columnNameList?.length > 0 &&
                columnNameList?.map((column: columnNamesType, index: number) => (
                  <th
                    key={index}
                    className={clsx("text-center p-table", !column?.headerCellProps && "min-w-40px")}
                    style={column?.headerCellProps}
                  >
                    {column.name}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className={clsx(bodyClasses)}>
            {/* <tr>
              <td className="cell-action"></td>
              {columnNameList?.length > 0 && columnNameList?.map((column: columnNamesType, index: number) =>
                <td className="spaces px-8" key={index}>
                  {
                    column?.sorting && <input
                      className="w-100 customs-input form-control"
                      type="text"
                      name={column?.field}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyUp}
                    />
                  }
                </td>
              )}
            </tr> */}
            {dataTable?.length > 0 ? (
              dataTable?.map((row: any, index: number) => (
                <TableRow
                  row={row}
                  key={index}
                  index={index}
                  nameParent={nameParent && nameParent}
                  nameChildren={nameChildren}
                  columnNameList={columnNameList}
                  handleCheckBox={handleCheckBox}
                  selectionMode={selectionMode && selectionMode}
                  handleSingleSelect={handleSingleSelect}
                  toggleRowSelection={toggleRowSelection}
                  handleCheckBoxAll={handleCheckBoxAll}
                  parentIndex={index}
                  isSelect={isSelect}
                  disabledSelect={disabledSelect}
                  handleDoubleClick={handleDoubleClick} />
              ))
            ) : (
              <tr>
                <td
                  className="text-center"
                  colSpan={columnNameList?.length + 1}
                >
                  {lang("GENERAL.NO_DATA")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {shouldOpenConfirmDeleteDialog && (
          <ConfirmDialog
            show={shouldOpenConfirmDeleteDialog}
            title={lang("DIALOG.CONFIRM.DELETE.TITLE")}
            message={lang("DIALOG.CONFIRM.DELETE.MESSAGE")}
            yes={lang("BTN.CONFIRM")}
            onYesClick={() => {
              const ids = getCheckedItems(itemList)
                ?.map((row) => row?.[uniquePrefix])
                ?.toString();
              handleDelete && handleDelete(ids);
              setShouldOpenConfirmDeleteDialog(false);
            }}
            cancel={lang("BTN.CANCEL")}
            onCancelClick={() => setShouldOpenConfirmDeleteDialog(false)} />
        )}
      </div>
    </>
  );
};

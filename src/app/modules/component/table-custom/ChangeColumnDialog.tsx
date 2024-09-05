import { Modal, Button } from "react-bootstrap";
import { useIntl } from "react-intl";
import { columnNamesType } from "./TableCustom";
import { KTSVG } from "../../../../_metronic/helpers";
import React, { useState } from "react";

interface Iprops {
  handleClose: () => void;
  columns: columnNamesType[];
  handleDragColumns: (columns: columnNamesType[]) => void;
}
const ChangeColumnDialog = (props: Iprops) => {
  const { handleClose, columns, handleDragColumns } = props;

  const intl = useIntl();
  const [visibleColumns, setVisibleColumns] = useState<columnNamesType[]>(columns);

  //save reference for dragItem and dragOverItem
  const dragItem = React.useRef<any>(null);
  const dragOverItem = React.useRef<any>(null);

  //handle drag sorting
  const handleSort = () => {
    const _columns = [...columns];
    //remove and save the dragged item content
    const draggedItemContent = _columns.splice(dragItem.current, 1)[0];
    //switch the position
    _columns.splice(dragOverItem.current, 0, draggedItemContent);
    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;
    //update array
    setVisibleColumns(_columns)
  }

  const handleChangeDisplayColumns = (index: number) => {
    const _columns = [...columns];
    _columns[index].isVisible = !_columns[index].isVisible;
    setVisibleColumns(_columns);
  }

  const handleSave = () => {
    handleDragColumns(visibleColumns);
    handleClose();
  }

  return (
    <>
      <Modal
        className="custom-modal"
        show={true}
        onHide={handleClose}
        centered
        size={"sm"}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-pri ">
            {" "}
            {intl.formatMessage({ id: "GENERAL.CUSTOMIZECOLUMN" })}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          <div className="list-wrapper">
            {visibleColumns.map((column: columnNamesType, index: number) => (
              <div
                className="p-4 flex-near justify-content-between cursor-move border"
                key={column?.field}
                onClick={() => {}}
                draggable
                onDragStart={(e) => dragItem.current = index}
                onDragEnter={(e) => dragOverItem.current = index}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
              >
                <label>
                  <input
                    type="checkbox"
                    className="check-box-row"
                    checked={column?.isVisible}
                    onClick={() => handleChangeDisplayColumns(index)}
                  />{" "}
                  {column?.name}
                </label>
                <KTSVG
                  path={"/media/icons/duotune/text/txt011.svg"}
                  className="svg-icon-2 color-primary"
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            className="button-primary"
            onClick={handleSave}
          >
            {intl.formatMessage({ id: "BTN.APPLY" })}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { ChangeColumnDialog };

import { FC } from "react";
import {
  ButtonToolbar,
  OverlayTrigger,
  Pagination,
  Tooltip,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useIntl } from "react-intl";
import clsx from "clsx";

interface TablePaginationProps {
  handlePagesChange: (
    num: number,
    currentPage: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number
  ) => void;
  handleRowsPerPageChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
  ) => void;
  rowsPerPage: number;
  rowsForPage: number[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  className?: string;
  hasFirst?: boolean;
  hasLast?: boolean;
}
const TablePagination: FC<TablePaginationProps> = (props) => {
  const {
    handlePagesChange,
    handleRowsPerPageChange,
    rowsPerPage,
    rowsForPage,
    page,
    setPage,
    setRowsPerPage,
    totalPages,
    className,
    hasFirst,
    hasLast,
    totalElements,
    numberOfElements,
  } = props;
  const intl = useIntl();
  const pageNeighbours = 2;

  const range = (start: number, end: number) => {
    const arr = [];
    for (let index = start; index < end; index++) {
      arr.push(index);
    }
    return arr;
  };

  function fetchPageNumbers() {
    const totalNumbers = pageNeighbours * 2 + 1;
    const startPage = Math.max(2, page - pageNeighbours);
    const endPage = Math.min(totalPages - 1, page + pageNeighbours);

    let pages = range(startPage, endPage);

    if (totalPages > totalNumbers && page <= 3) {
      pages = range(1, totalNumbers);
      return (
        <div className="d-flex">
          {pages?.map((i) => (
            <Pagination.Item
              key={i}
              active={i === page}
              onClick={() => setPage(i)}
            >
              {i}
            </Pagination.Item>
          ))}
          <Pagination.Ellipsis />
          <Pagination.Item
            active={totalPages === page}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        </div>
      );
    }
    if (
      totalPages > totalNumbers &&
      page > 3 &&
      page <= totalPages - pageNeighbours - 1
    ) {
      pages = [page - 1, page, page + 1];
      return (
        <div className="d-flex">
          <Pagination.Item active={1 === page} onClick={() => setPage(1)}>
            1
          </Pagination.Item>
          <Pagination.Ellipsis />
          {pages?.map((i) => (
            <Pagination.Item
              key={i}
              active={i === page}
              onClick={() => setPage(i)}
            >
              {i}
            </Pagination.Item>
          ))}
          <Pagination.Ellipsis />
          <Pagination.Item
            active={totalPages === page}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        </div>
      );
    }
    if (totalPages <= totalNumbers) {
      const items = range(1, totalPages + 1)
      return (
        <div className="d-flex">
          {items?.map((i) => (
            <Pagination.Item
              key={i}
              active={i === page}
              onClick={() => setPage(i)}
            >
              {i}
            </Pagination.Item>
          ))}
        </div>
      );
    }
    if (page > totalPages - pageNeighbours - 1) {
      pages = [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      return (
        <div className="d-flex">
          <Pagination.Item active={1 === page} onClick={() => setPage(1)}>
            1
          </Pagination.Item>
          <Pagination.Ellipsis />
          {pages?.map((i) => (
            <Pagination.Item
              key={i}
              active={i === page}
              onClick={() => setPage(i)}
            >
              {i}
            </Pagination.Item>
          ))}
        </div>
      );
    }

  }

  return (
    <div className="flex flex-space-between">
      <div className="d-flex justify-content-centerr gap-2 align-items-center ps-3 pe-3">
          Tổng số bản ghi: {numberOfElements? numberOfElements + "/" : ""}{totalElements}
      </div>
      <div
        className={clsx(
          "flex pagination-container justify-content-end gap-2 border-top align-items-center bg-white",
          className
        )}
      >
        <Pagination className="paginationV2 justify-content-center align-items-center my-2">
          <ButtonToolbar className="flex-nowrap">
            <OverlayTrigger
              placement="top"
              delay={150}
              overlay={
                <Tooltip id="tooltip" className="in">
                  <b>{intl.formatMessage({ id: "TABLE.PAGINATION.FIRST" })}</b>
                </Tooltip>
              }
            >
              <Pagination.First
                disabled={page === 1}
                onClick={() => handlePagesChange(-2, page, setPage, totalPages)}
                hidden={!hasFirst}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={150}
              overlay={
                <Tooltip id="tooltip" className="in">
                  <b>{intl.formatMessage({ id: "TABLE.PAGINATION.PREVIOUS" })}</b>
                </Tooltip>
              }
            >
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => handlePagesChange(-1, page, setPage, totalPages)}
              />
            </OverlayTrigger>
            {fetchPageNumbers()}
            <OverlayTrigger
              placement="top"
              delay={150}
              overlay={
                <Tooltip id="tooltip" className="in">
                  <b>{intl.formatMessage({ id: "TABLE.PAGINATION.NEXT" })}</b>
                </Tooltip>
              }
            >
              <Pagination.Next
                disabled={page === totalPages}
                onClick={() => handlePagesChange(1, page, setPage, totalPages)}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={150}
              overlay={
                <Tooltip id="tooltip" className="in">
                  <b>{intl.formatMessage({ id: "TABLE.PAGINATION.LAST" })}</b>
                </Tooltip>
              }
            >
              <Pagination.Last
                disabled={page === totalPages}
                onClick={() => handlePagesChange(2, page, setPage, totalPages)}
                hidden={!hasLast}
              />
            </OverlayTrigger>
          </ButtonToolbar>
        </Pagination>
        <div className="d-flex justify-content-centerr gap-2 align-items-center ps-3 pe-3">
          Số hàng :
          <Form.Select
            size="sm"
            value={rowsPerPage}
            onChange={(e) => {
              setPage(1);
              handleRowsPerPageChange(e, setRowsPerPage);
            }}
            className="w-70px select"
          >
            {rowsForPage.map((item) => (
              <option key={item} value={item}>
                <div className="fs-14px">{item}</div>
              </option>
            ))}
          </Form.Select>
        </div>
      </div>
    </div>
  );
};
export { TablePagination };

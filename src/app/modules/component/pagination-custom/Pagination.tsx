import { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";
import { rowPerPage } from "../../constant";


type IProps = {
  totalPage: number;
  pageIndex: number;
  pageSize?: number;
  totalElements?: number;
  numberOfElements?: number;
  changePage: (value: number) => void;
  changePerPage?: (value: number) => void;
  changeRowPerPage?: boolean;
};

function PaginationCustom({ totalPage, pageIndex, changePage, changePerPage, pageSize, changeRowPerPage, numberOfElements, totalElements }: IProps) {
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    if (pageIndex >= 1) {
      setPage(pageIndex);
    }
  }, [pageIndex]);

  const _onChangePage = (value: number) => () => {
    setPage(value);
    if (changePage) {
      changePage(value);
    }
  };


  return (
    <div className="pagination d-flex justify-content-around pagination-container">
      <p>{`${numberOfElements || 0}/${totalElements || 0}`}</p>
      {changeRowPerPage && <div className="pagination-goto">
        <label className="me-2">Số bản ghi</label>
        <select
          value={pageSize}
          onChange={(e) => {
            changePerPage && changePerPage(Number(e.target.value));
          }}
        >
          {rowPerPage.map((row) => (
            <option value={row}>{row}</option>
          ))}
        </select>
      </div>}
      <div className="pagination">
        <Pagination size="sm">
          <div className="pagination-action btn p-2" aria-label="Previous" onClick={_onChangePage(totalPage ? 1 : 0)}>
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </div>
          <Pagination.Prev
            className="pagination-action"
            disabled={page < 2}
            onClick={_onChangePage(Number(page - 1))}
          />
          {page > 1 && <Pagination.Item onClick={_onChangePage(1)}>{1}</Pagination.Item>}

          {page >= 4 && <Pagination.Ellipsis />}

          {page > 2 && (
            <Pagination.Item className="pagination-page" onClick={_onChangePage(page - 1)}>
              {page - 1}
            </Pagination.Item>
          )}

          <Pagination.Item className="pagination-page pagination-active">
            {page}
          </Pagination.Item>

          {page + 1 < totalPage && (
            <Pagination.Item className="pagination-page" onClick={_onChangePage(page + 1)}>
              {page + 1}
            </Pagination.Item>
          )}

          {page + 2 < totalPage && <Pagination.Ellipsis />}
          {page < totalPage && (
            <Pagination.Item className="pagination-page" onClick={_onChangePage(totalPage)}>
              {totalPage}
            </Pagination.Item>
          )}
          <Pagination.Next
            className="pagination-action"
            disabled={page === totalPage}
            onClick={_onChangePage(Number(page + 1))}
          />

          <div className="pagination-action btn p-2" aria-label="Next" onClick={_onChangePage(totalPage)}>
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only">Next</span>
          </div>
        </Pagination>
      </div>
    </div>
  );
}

export default PaginationCustom;

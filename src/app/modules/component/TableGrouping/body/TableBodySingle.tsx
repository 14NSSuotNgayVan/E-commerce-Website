import { IColumns } from "../TableGrouping";

interface IProps {
  data: any[];
  columns: IColumns[];
  page: number;
  rowsPerPage: number;
  handleDoubleClick?: (row: any) => void;
}

function TableBodySingle(props: IProps) {
  const { data, columns, page, rowsPerPage, handleDoubleClick } = props;

  return (
    <>
      {data?.map((row: any, index: number) => (
        <tr
          key={index + "single"}
          className="border-bottom border"
          onClick={() => handleDoubleClick && handleDoubleClick(row)}
        >
          {columns.map((item, idx) => {
            return (
              <td
                key={item.field + idx}
                className="td-vertical-center bg-white"
                style={item?.cellStyle}
              >
                {item?.render && page && rowsPerPage
                  ? item?.render(row, index, (page - 1) * rowsPerPage + index + 1, data)
                  : row[item?.field]}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

export default TableBodySingle;

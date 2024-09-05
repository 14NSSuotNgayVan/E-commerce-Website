import React from 'react';
import { useIntl } from 'react-intl';
import './style.scss'
export interface Column<T> {
  title: string;
  render: (item: T,index:number) => React.ReactNode;
}

interface Props<T> {
  listColumns: Column<T>[];
  listData: T[];
  handleEdit: (item: T) => void;
  handleDelete: (id: string) => void;
}

const TableComponentChild = <T extends { id: string; }>({
  listColumns,
  listData,
  handleEdit,
  handleDelete
}: Props<T>) => {
  const intl = useIntl();

  return (
    <table className="table text-center custom-table">
      <thead>
        <tr>
          {listColumns.map((column, index) => (
            <th key={index} className="table-th-custom text-white">
              {intl.formatMessage({ id: column.title })}
            </th>
          ))}
          <th className="table-th-custom text-white">
            {intl.formatMessage({ id: 'TABLE.ACTION' })}
          </th>
        </tr>
      </thead>
      <tbody>
        {listData.map((item: T, index) => (
          <tr key={index}>
            {listColumns.map((column, columnIndex) => {
              const renderedContent = column.render(item, index);
              return (
                <React.Fragment key={columnIndex}>
                  {React.isValidElement(renderedContent) ? (
                    React.cloneElement(renderedContent, { key: columnIndex })
                  ) : (
                    <td key={columnIndex} className="col">
                      {renderedContent}
                    </td>
                  )}
                </React.Fragment>
              );
            })}
            <td className="col-1 text-center">
              <i
                className="fa-solid fa-pen text-primary me-5 icon-hover"
                onClick={() => handleEdit(item)}
              ></i>
              <i
                className="fa-solid fa-trash text-danger icon-hover"
                onClick={() => handleDelete(item.id)}
              ></i>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponentChild;

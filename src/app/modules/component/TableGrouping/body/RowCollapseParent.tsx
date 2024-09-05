import TableGroupingContext from "../TableGroupingContext";
import TableBodySingle from "./TableBodySingle";
import { useContext, useState } from "react";

interface IProps {
  data: any;
  keyRow: any;
}

function RowCollapseParent(props: IProps) {
  const { data, keyRow } = props;
  const { columnsConvert, page, rowsPerPage, secondLevelDataField, secondLevelTitleField, handleDoubleClick } = useContext(TableGroupingContext);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);

  const handleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <>
      <tr
        onClick={handleCollapse}
        key={keyRow + "parrent"}
      >
        <td
          className="spaces fw-bold pl-16"
          colSpan={columnsConvert.length}
        >
          <div className="w-full flex flex-middle">
            <span className={`${isCollapse ? "chervon-rotate-down" : ""} flex transition-linear`}>
              <i className="bi bi-chevron-right text-header-table"></i>
            </span>
            <span className="spaces pl-16">{data?.[secondLevelTitleField]}</span>
          </div>
        </td>
      </tr>
      {isCollapse && (
        <TableBodySingle
          columns={columnsConvert}
          data={data?.[secondLevelDataField] || []}
          page={page}
          rowsPerPage={rowsPerPage}
          handleDoubleClick={handleDoubleClick}
        />
      )}
    </>
  );
}

export default RowCollapseParent;

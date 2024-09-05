import { useContext } from "react";
import useMultiLanguage from "../../../../hook/useMultiLanguage";
import { IColumnsTotal } from "../TableGrouping";
import TableGroupingContext from "../TableGroupingContext";

interface Iprops {
  data: {[key: string] : number};
  dataBase: any;
  columnsTotal: IColumnsTotal[];
}
function RowTotal(props: Iprops) {
  const { data, dataBase, columnsTotal } = props;
  const { firstLevelTitleField } = useContext(TableGroupingContext);
  const { lang } = useMultiLanguage();

  return (
    <tr className="border-bottom border">
      {columnsTotal.map((item, index) => {
        return item?.isTitle ? (
          <td
            key={item?.field + index}
            className="td-vertical-center bg-white"
            style={item?.cellStyle}
            colSpan={item?.colSpan}
          >
            {lang("GENERAL.TOTAL") + " " + (dataBase?.[firstLevelTitleField] || "") + " :"}
          </td>
        ) : (
          <td
            key={item?.field + index}
            className="td-vertical-center bg-white"
            style={item?.cellStyle}
          >
            {item?.render ? item?.render(data) : data[item?.field]}
          </td>
        );
      })}
    </tr>
  );
}

export default RowTotal;

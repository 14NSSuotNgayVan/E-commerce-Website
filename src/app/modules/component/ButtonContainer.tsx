import { FC } from "react";
import { useIntl } from "react-intl";
import { KTSVG } from "../../../_metronic/helpers";
interface Iprops {
  handleExportExcel?: () => void;
  handleOpenAddNew: () => void;
  isView: boolean;
  openButtonAdd: boolean;
  openButtonExport: boolean;
}
const ButtonContainer: FC<Iprops> = (props) => {
  const { handleExportExcel, handleOpenAddNew, isView, openButtonAdd , openButtonExport} = props;
  const intl = useIntl();
  return (
    <div className="flex">
      {!isView && openButtonAdd && (
        <button className="button-primary flex table-btn me-2" onClick={handleOpenAddNew}>
          <KTSVG path="/media/icons/add.svg" />{" "}
          {intl.formatMessage({ id: "BTN.ADD" })}
        </button>
      )}
      {openButtonExport && (
        <button className="flex table-btn outline" onClick={handleExportExcel}>
          <KTSVG path="/media/icons/export-excel.svg" />{" "}
          {intl.formatMessage({ id: "BTN.EXPORT" })}
        </button>
      )}
    </div>
  );
};
export { ButtonContainer };


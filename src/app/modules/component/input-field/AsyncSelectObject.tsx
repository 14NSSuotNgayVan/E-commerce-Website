import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { SELECT_OPTION } from "../../../constants/Common";
import { OptionReactSelect } from "../../models/models";
import "../../styles/index.scss";
import { TYPE } from "../../utils/Constant";

type Props = {
  label: string;
  name: string;
  isView?: boolean;
  value: string;
  handleChange: ((name: string, value: any) => void) | (() => void);
  getOption: any;
  type?: string;
  required?: boolean;
  errors?: any | null;
};
// eslint-disable-next-line react-refresh/only-export-components
export const customStyles = {
  // Tùy chỉnh kiểu dáng của phần tử control (khung bao ngoài)
  control: (provided: any) => ({
    ...provided,
    background: "#fff",
    borderColor: "#E4E6EF",
    minHeight: "35.2px",
    height: "35.2px",
    boxShadow: "none",
    width: "100%",
    padding: "0px",
    borderRadius: "5px",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: "35px",
    padding: "0 6px",
  }),
  input: (provided: any) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: "35px",
  }),
  // Tùy chỉnh kiểu dáng của mỗi lựa chọn trong dropdown
  option: (provided: any) => ({
    ...provided,
    color: "#5E6278",
    fontSize: "14px",
    backgroundColor: "white",
    "&:hover": {
      background: "#2E2C9A",
      color: "#fff",
      opacity: 0.8,
    },
  }),
  // Tùy chỉnh kiểu dáng của nhãn hiển thị giá trị đã chọn
  singleValue: (provided: any) => ({
    ...provided,
    color: "#5E6278",
    fontSize: "14px",
    fontWeight: "500",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    padding: "0px",
  }),
};
const AsyncSelectObject = (props: Props) => {
  const { label, name, isView, value, handleChange, getOption, type, required, errors } = props;
  const intl = useIntl();
  const [options, setOptions] = useState<OptionReactSelect[]>();
  const handleCallAPI = useCallback(async () => {
    const response = await getOption();
    setOptions(response?.data?.data?.content || []);
  }, [getOption]);

  const handleChangeSelect = (option: any, event: any) => {
    if (
      event.action === SELECT_OPTION.SELECT_ACTION ||
      event.action === SELECT_OPTION.CLEAR_ACTION
    ) {
      const isSelectOption = event.action === SELECT_OPTION.SELECT_ACTION;

      if (type === TYPE.OBJECT) {
        const newValue = isSelectOption ? option : ({} as OptionReactSelect);
        handleChange(name, newValue);
      } else {
        const idValue = isSelectOption ? option?.id : "";
        const textValue = isSelectOption ? option?.name || option?.value : "";

        handleChange(`${name}Id`, idValue);
        handleChange(`${name}Text`, textValue);
      }
    }
  };
  useEffect(() => {
    handleCallAPI();
  }, [handleCallAPI]);

  return (
    <>
      <div className="text-label mb-2">
        <span>{intl.formatMessage({ id: label })}</span>
        {required && <span style={{ color: "red" }}> *</span>}
      </div>
      <Select
        className={errors ? "container-fluid p-0 mt-1 select-invalid" : "container-fluid p-0 mt-1"}
        name={name}
        options={options}
        isDisabled={isView}
        isClearable={true}
        onFocus={handleCallAPI}
        value={options?.find((option) => option?.id === value)}
        getOptionLabel={(option: any) => option?.name || option?.value}
        styles={customStyles}
        onChange={handleChangeSelect}
      />
      {errors && <div className="text-danger">{errors}</div>}
    </>
  );
};

export default AsyncSelectObject;

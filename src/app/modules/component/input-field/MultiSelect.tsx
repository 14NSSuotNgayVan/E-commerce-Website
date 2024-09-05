import { useIntl } from "react-intl";
import Select from "react-select";
import { OptionReactSelect } from "../../models/models";
import "../../styles/index.scss";
import { useCallback, useEffect, useState } from "react";
import { convertArray } from "../../utils/FunctionUtils";

type Props = {
  label: string;
  name: string;
  isView?: boolean;
  handleChange: ((name: string, value: any) => void) | (() => void);
  getOption: any;
  type?: string;
  required?: boolean;
  errors?: any | null;
  value: string[];
};

const AsyncMultiSelectString = (props: Props) => {
  const { label, name, isView, handleChange, getOption, required, errors, value } = props;
  const intl = useIntl();
  const [options, setOptions] = useState<OptionReactSelect[]>();
  const handleCallAPI = useCallback(async () => {
    const response = await getOption();
    setOptions(response?.data?.data?.content);
  }, [getOption]);

  const handleChangeSelect = (options: any, event: any) => {
    let optionString: string[] = [];
    if (event.action === "clear") {
      optionString = [];
    } else if (event.action === "remove-value" && event.removedValue) {
      optionString = options
        .filter((option: any) => option.name !== event.removedValue.name)
        .map((option: any) => option.name);
    } else {
      optionString = options.map((option: any) => option.name);
    }

    handleChange(name, optionString);
  };

  useEffect(() => {
    handleCallAPI();
  }, [handleCallAPI]);

  return (
    <div>
      <div className="text-label mb-2">
        <span>{intl.formatMessage({ id: label })}</span>
        {required && <span style={{ color: "red" }}> *</span>}
      </div>
      <Select
        className={errors ? "container-fluid p-0 mt-1 select-invalid" : "container-fluid p-0 mt-"}
        name={name}
        options={options}
        isDisabled={isView}
        isMulti
        isClearable={true}
        onFocus={handleCallAPI}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.name}
        value={convertArray(value)}
        onChange={handleChangeSelect}
      />
      {errors && <div className="text-danger">{errors}</div>}
    </div>
  );
};

export default AsyncMultiSelectString;

import { useIntl } from "react-intl";
import Select from "react-select";
import { OptionReactSelect } from "../../models/models";
import "../../styles/index.scss";
import "../style.scss";
import { customStyles } from "./AsyncSelectObject";

type Props = {
  label: string;
  name: string;
  isView?: boolean;
  value: OptionReactSelect | null;
  handleChange: (name: string, value:  OptionReactSelect) => void;
  Option: OptionReactSelect[];
  required?: boolean;
  errors?: any | null;
};

const SelectObjectField = (props: Props) => {
  const { label, name, isView, value, handleChange, Option, required, errors } = props;
  const intl = useIntl();
  return (
    <>
      <div className='text-label mb-2'>
        <span>
          {intl.formatMessage({ id: label })}
        </span>
        {required && <span style={{ color: 'red' }}> *</span>}
      </div>
      <Select
        className={
          errors
            ? 'container-fluid p-0 select-invalid'
            : 'container-fluid p-0'
        }
        name={name}
        options={Option}
        isDisabled={isView}
        isClearable={true}
        value={value}
        getOptionLabel={(option:any)=>option.name || option.value}
        styles={customStyles}
        onChange={(option: any) => {
          handleChange(name, option)
        }}
      />
      {errors && <div className='text-danger'>{errors}</div>}
    </>
  );
};

export default SelectObjectField;

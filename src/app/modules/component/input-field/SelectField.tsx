import { ErrorMessage } from 'formik';
import { useIntl } from 'react-intl';
import Select from 'react-select';
import { OptionReactSelect } from '../../models/models';
import '../../styles/index.scss';
type Props = {
  label: string;
  name: string;
  isView?: boolean;
  value: string;
  handleChange: (name: string, value: string|number ) => void;
  Option: OptionReactSelect[];
};
  // eslint-disable-next-line react-refresh/only-export-components
  export const customStyles = {
    // Tùy chỉnh kiểu dáng của phần tử control (khung bao ngoài)
    control: (provided: any) => ({
      ...provided,
      background: '#fff',
      borderColor: '#E4E6EF',
      minHeight: '43.2px',
      height: '43.2px',
      boxShadow: 'none',
      width: '100%',
      padding: '0px',
      borderRadius:'5px'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '35px',
      padding: '0 6px'
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '35px',
    }),
    // Tùy chỉnh kiểu dáng của mỗi lựa chọn trong dropdown
    option: (provided: any, state: any) => ({
      ...provided,
      color: "#5E6278",
      fontSize:'14px',
      backgroundColor: state.isSelected ? "#2E2C9A" : "white",
      '&:hover': {
        background: '#2E2C9A',
        color: "#fff",
        opacity: 0.8,
      },
    }),
    // Tùy chỉnh kiểu dáng của nhãn hiển thị giá trị đã chọn
    singleValue: (provided: any) => ({
      ...provided,
      color: '#5E6278',
      fontSize: '14px',
      fontWeight:'500'
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      padding: '0px',
      paddingTop:'8px'
    }),
  };
const SelectField = (props: Props) => {
  const { label, name, isView, value, handleChange,Option } = props;
  const intl = useIntl();


  return (
    <>
      <span className="text-label ">{intl.formatMessage({ id: label })}</span>
      <Select
        className="container-fluid p-0 mt-2"
        name={name}
        options={Option}
        isDisabled={isView}
        isClearable={true}
        value={Option.find((option) => option.code === value)}
        onChange={(selectedOption) =>selectedOption?.code && handleChange(name, selectedOption?.code)}
        styles={customStyles}
      />
      <ErrorMessage name={name}>{(msg) => <div className="text-danger">{msg}</div>}</ErrorMessage>
    </>
  );
};

export default SelectField;

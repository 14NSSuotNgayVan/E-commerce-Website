import { ErrorMessage, FormikHandlers } from 'formik';
import { ElementType, FC } from 'react';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import Select from 'react-select';
import { inputTypeList } from '../../constant';


interface Iprops {
  values: any;
  errors?: string | undefined;
  options?: any[];
  optionLabel?: string,
  optionValue?:string,
  optionsByAPI?: any;
  name: string;
  title: string;
  type: string;
  required?: boolean;
  readOnly?: boolean;
  as?: ElementType<any> | undefined;
  rows?: string;
  handleChange: FormikHandlers['handleChange'];
}
const InputCustom: FC<Iprops> = (props) => {
  const {
    values,
    handleChange,
    errors,
    name,
    options,
    optionLabel="name",
    optionValue="id",
    title,
    type,
    required,
    readOnly,
    as,
    rows,
  } = props;

  const intl = useIntl();
  const customStyles = {
    // Tùy chỉnh kiểu dáng của phần tử control (khung bao ngoài)
    control: (provided: any) => ({
      ...provided,
      background: '#fff',
      borderColor: !errors ? '#E4E6EF' : '#f1416c',
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
      fontWeight:'500',
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      padding: '0px',
      paddingTop:'8px',
    }),
  };


  return (
    <>
      <div className='item-content'>
        <Form.Label htmlFor={name}>
          <span className='text-label'>{intl.formatMessage({ id: title })}</span>

          {required && <span className='text-danger'> * </span>}
        </Form.Label>
        {type === inputTypeList.select && (
          <>
            <Select
              className='container-fluid p-0'
              name={name}
              options={options}
              isDisabled={readOnly}
              isClearable={true}
              getOptionLabel={(option) => option[optionLabel]}
              getOptionValue={(option) => option[optionValue]}
              value={values}
              onChange={handleChange}
              styles={customStyles}
            />
          </>
        )}
        {type === 'checkbox' && (
          <Form.Check
            id={name}
            readOnly={readOnly}
            type={type}
            name={name}
            value={values}
            onChange={handleChange}
            isInvalid={!!errors}
          />
        )}
        {(type === inputTypeList.text
          || type === inputTypeList.date
          || type === inputTypeList.number
          || type === inputTypeList.file)
          && (
          <Form.Control
            as={as}
            id={name}
            rows={rows}
            readOnly={readOnly}
            type={type}
            name={name}
            value={values}
            onChange={handleChange}
            isInvalid={!!errors}
            placeholder={intl.formatMessage({ id: title }) }
          />
        )}
        <ErrorMessage name={name}>
          {(msg) => <div className='text-danger'>{msg}</div>}
        </ErrorMessage>
      </div>
    </>
  );
};
export { InputCustom };

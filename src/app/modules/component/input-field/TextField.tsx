import { Field, FormikHandlers } from 'formik';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
type Props = {
  label: string;
  name: string;
  isView?: boolean;
  value: string | number;
  type: string | number;
  handleChange: (() => void) | FormikHandlers["handleChange"] | any;
  errors?: any;
  required?: boolean;
  render?: () => void;
  endAdornment?: ReactNode;
  onBlur?: () => void;
};

const TextField = (props: Props) => {
  const {
    label,
    name,
    isView,
    value,
    handleChange,
    type,
    errors,
    required,
    endAdornment,
    onBlur,
  } = props
  const intl = useIntl();
  return (
    <>
      <div className='text-label mb-2'>
        <span>
          {intl.formatMessage({ id: label })}
        </span>
        {required && <span style={{ color: 'red' }}> *</span>}
      </div>
      <div style={{ position: 'relative' }}>
        <Field
          className={
            errors
              ? 'form-control is-invalid'
              : 'form-control'
          }
          onBlur={onBlur}
          name={name}
          type={type}
          readOnly={isView}
          value={value}
          onChange={handleChange}
          placeholder={intl.formatMessage({ id: label })}
        />
        {
          endAdornment &&
          <div className='inputAdornment'>
            {endAdornment}
          </div>
        }
      </div>
      {errors && <div className='text-danger'>{errors}</div>}
    </>
  )
}

export default TextField
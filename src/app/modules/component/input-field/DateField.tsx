import { ErrorMessage, Field, FormikHandlers } from 'formik';
import { useIntl } from 'react-intl';
import { covertDateToString } from '../../utils/FunctionUtils';

type Props = {
  label: string,
  name: string,
  isView: boolean,
  value: Date,
  handleChange: (() => void)| FormikHandlers['handleChange'];
};

const DateField = (props: Props) => {
  const { label, name, isView, value, handleChange } = props;
  const intl = useIntl();
  return (
    <>
      <span className='text-label mb-2'>
        {intl.formatMessage({ id: label })}
      </span>
      <Field
        className='form-control'
        name={name}
        type='date'
        readOnly={isView}
        value={covertDateToString(value)}
        onChange={handleChange}
      />
      <ErrorMessage name={name}>
        {(msg) => <div className='text-danger'>{msg}</div>}
      </ErrorMessage>
    </>
  );
};

export default DateField;
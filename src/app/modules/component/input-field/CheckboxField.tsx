import { ErrorMessage } from 'formik';
import { useIntl } from 'react-intl';

type Props = {
  label: string,
  name: string,
  isView?: boolean,
  value: boolean,
  handleChange: any;
};

const CheckboxField = (props: Props) => {
  const { label, name, isView, value, handleChange } = props;
  const intl = useIntl();
  return (
    <>
      <span className='text-label'>
        {intl.formatMessage({ id: label })}
      </span>
      <input type="checkbox"
        className="form-check-input mt-0 checkbox-content"
        value={value?'true':'false'}
        onChange={handleChange}
        disabled={isView}
        name={name}
        checked={value}
      />
      <ErrorMessage name={name}>
        {(msg) => <div className='text-danger'>{msg}</div>}
      </ErrorMessage>
    </>
  );
};

export default CheckboxField;
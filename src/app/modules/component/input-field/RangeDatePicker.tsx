import { FormikErrors, FormikHandlers, FormikTouched } from "formik";
import { Col, Row } from "react-bootstrap";
import { useIntl } from "react-intl";
import { covertDateToString, handleBlurDate } from "../../utils/FunctionUtils";
import TextValidator from "./TextValidator";

type IProps = {
  label: string | undefined;
  startDateName: string;
  endDateName: string;
  value: any;
  isView?: boolean;
  handleChange?: (() => void) | FormikHandlers["handleChange"];
  isRequired?: boolean;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>
  touch?: FormikTouched<any>;
  errors?: FormikErrors<any>;
  isReadOnlyStartDate?: boolean;
  isReadOnlyEndDate?: boolean;
};

export const RangeDatePicker: React.FC<IProps> = ({
  label,
  startDateName,
  endDateName,
  value,
  isView,
  handleChange,
  setFieldValue,
  isRequired,
  touch,
  errors,
  isReadOnlyStartDate,
  isReadOnlyEndDate
}) => {
  const intl = useIntl();

  return (
    <div className="flex-column">
      <span className="text-lable-input lable">
        {label}
        {isRequired && <span className="color-red"> *</span>}
      </span>
      <Row>
        <Col xs={6} sm={6}>
          <TextValidator
            name={startDateName}
            type="date"
            readOnly={isView || isReadOnlyStartDate}
            value={covertDateToString(value[startDateName])}
            onChange={handleChange}
            touched={touch?.[startDateName]}
            errors={errors?.[startDateName]}
            onBlur={() =>
              handleBlurDate(setFieldValue, value[startDateName], startDateName)
            }
          />
        </Col>
        <Col xs={6} sm={6}>
          <TextValidator
            name={endDateName}
            type="date"
            readOnly={isView || isReadOnlyEndDate}
            value={covertDateToString(value[endDateName])}
            onChange={handleChange}
            touched={touch?.[endDateName]}
            errors={errors?.[endDateName]}
            onBlur={() =>
              handleBlurDate(setFieldValue, value[endDateName], endDateName)
            }
          />
        </Col>
        <Col sm={12}>
          <div>
            {(errors?.[startDateName] || errors?.[endDateName]) && <div className="invalid-feedback">{intl.formatMessage({
              id: "VALIDATION.REQUIRE"
            })}</div>}
          </div>
        </Col>
      </Row>
    </div>
  );
};

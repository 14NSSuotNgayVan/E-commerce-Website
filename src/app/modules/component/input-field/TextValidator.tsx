import { Form, FormControl } from 'react-bootstrap';
import { TYPE } from '../../utils/Constant';
import { useEffect, useRef, useState } from 'react';

const TextValidator = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputHeight, setInputHeight] = useState<any>(null);
  const isPasswordType = props?.type === TYPE.PASSWORD;
  const inputType = isPasswordType ? (!showPassword ? TYPE.PASSWORD : TYPE.TEXT) : props?.type;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      setInputHeight(inputRef.current.offsetHeight);
    }
  }, []);

  const onChange = (event: any) => {
    if(event?.target?.value?.startsWith(" ")) {
      event.target.value = "";
    }
    props?.onChange(event);
  }

  return (
    <div className={props?.className}>
      {props?.lable && (
        <span className={`text-lable-input lable`}>
          {props?.lable}
          {props?.isRequired && <span className="color-red"> *</span>}
        </span>
      )}
      <Form.Group className={`relative flex-grow-1`}>
        <FormControl
          {...props}
          ref={inputRef}
          placeholder={props?.placeholder || props?.lable || ""}
          type={inputType}
          className={`
                      ${props.errors && props.touched ? "is-invalid" : ""}
                      ${(props?.isSearch || isPasswordType) ? "background-image-none" : ""}
                      form-control customs-input
                      ${props?.as === TYPE.TEXTAREA ? "spaces py-7 px-12 resize-none" : ""}
                      ${props?.type === TYPE.NUMBER ? "no-spinners" : ""}
                      ${props?.readOnly ? "text-readOnly" :""}
                      ${isPasswordType && "spaces pr-40"}
                      ${props?.textCenter? "text-center" :""}
                  `}
          onChange={props?.onChange && onChange}
        />

        {props?.isSearch && (
          <div
            className="searchTextField"
            style={{ height: inputHeight }}
            onClick={props?.isSearch && props?.handleSearch}>
            <i className="bi bi-search"></i>
          </div>
        )}

        {(props?.icon || isPasswordType) && (
          <div
            className="searchTextField icon-eye border-0"
            style={{ height: inputHeight }}
            onClick={isPasswordType
              ? () => setShowPassword(!showPassword)
              : props?.icon && props?.handleIcon
            }
          >
            <i
              className={
                isPasswordType
                  ? `bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`
                  : props?.icon
              }
            ></i>
          </div>
        )}
        {props.touched && props.errors && <div className="invalid-feedback">{props.errors}</div>}
      </Form.Group>
    </div>
  );
};

export default TextValidator
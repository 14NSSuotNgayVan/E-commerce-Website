/* eslint-disable react-hooks/exhaustive-deps */
import clsx from "clsx";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select, { GetOptionLabel, mergeStyles } from "react-select";
import { toast } from "react-toastify";
import { AutoCompleteProps } from "../../models/autocomplete";
import { KEY, TYPE } from "../../utils/Constant";
import { autocompleteStyle, multiValueRemove } from "./StyleComponent";
import TextValidator from "./TextValidator";
import { removeDiacritics } from "../../utils/FunctionUtils";
import useMultiLanguage from "../../../hook/useMultiLanguage";

const Autocomplete: FC<AutoCompleteProps> = (props: AutoCompleteProps) => {
  const {
    options,
    onChange,
    searchFunction,
  } = props;
  const [optionList, setOptionList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [isCheckDataScroll, setIsCheckDataScroll] = useState<boolean>(false);
  const styles = { ...props?.styles, ...props?.isReadOnly ? multiValueRemove : {} }
  const combinedStyles = mergeStyles(autocompleteStyle, styles);
  const [keyword, setKeyword] = useState('');
  const { lang } = useMultiLanguage()

  const convertNameUrl = (value: string, item: any) => {
    const array = value.split(".")
    for (let i = 0; i < array.length; i++) {
      item = item?.[array[i]];
    }
    return item
  }

  const fetchData = async () => {
    if ((options?.length > 0 && !props.searchFunction) || props.isReadOnly) {
      setOptionList(options);
    } else if (!isLoading) {
      setIsLoading(true);
      try {
        if (props.searchObject !== undefined && props.searchFunction) {
          const data = await getData(props.searchObject)
          setPageIndex(props.searchObject?.pageIndex || 1)
          setOptionList(data)
          setIsCheckDataScroll(data?.length > 0)
          setIsLoading(false);
        } else {
          setOptionList(options)
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    (options?.length > 0) && fetchData();
    ((isFocus && optionList?.length === 0) || (props?.isScroll && !keyword)) && fetchData();
    return () => {
      setIsLoading(false);
    };
  }, [options, searchFunction, isFocus, props.value, keyword]);

  const getData = async (searchObject: any) => {
    const res = await props.searchFunction?.(searchObject);
    let data = props?.urlData ? convertNameUrl(props?.urlData, res) : res?.data?.data?.content;
    data = props?.sort ? props?.sort(data) : data
    return data;
  }

  useEffect(() => {
    if (props?.dependencies) {
      setOptionList([]);
      setSelectedValue(null)
    }
  }, props?.dependencies || []);

  useEffect(() => {
    getValue();
  }, [props.value, optionList]);


  const handleChange = (selectedOption: any) => {
    setSelectedValue(selectedOption);
    onChange?.(selectedOption);
  };

  const combinedClassName = clsx(
    props?.className ? props.className : "w-100",
    clsx(props.className, props.errors && props.touched && "ac-is-invalid", "autocomplete-custom radius")
  );

  const getValue = () => {
    if (typeof props?.value === TYPE.OBJECT) {
      setSelectedValue(props?.value)
      return;
    }

    if ((typeof props?.value === TYPE.STRING) || (typeof props?.value === TYPE.NUMBER)) {
      const value = optionList.find((option: any) => option[props?.valueSearch ? props?.valueSearch : "name"] === (props?.value ?? false))
      setSelectedValue(value)
      return;
    }

    setSelectedValue(null);
  };

  const handleScrollToBottom = async () => {
    try {
      if (isCheckDataScroll) {
        const searchObject = { ...props.searchObject }
        searchObject.pageIndex = pageIndex + 1
        if (props?.labelSearch) searchObject[props?.labelSearch] = keyword

        setIsLoading(true);
        const data = await getData(searchObject);
        setPageIndex(pageIndex + 1);
        setIsCheckDataScroll(data?.length > 0);
        setOptionList([...optionList, ...data]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false)
      toast.error("Xảy ra lỗi, vui lòng thử lại!");
    }
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLElement>) => {
    if (KEY.SPACE === event.code && !(event.target as HTMLInputElement).value) {
      event.preventDefault();
      return;
    }
  };

  const handleInputChange = (newValue: string) => {
    setKeyword(newValue?.trim());
  };

  const handleBlur = () => {
    setIsFocus(false);
    setKeyword("");
  }

  useEffect(() => {
    searchOption()
  }, [keyword, selectedValue])

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    props?.setIsCheckBox && props?.setIsCheckBox(event?.target?.checked)
  };

  const searchOption = async () => {
    try {
      if (props?.isScroll && !selectedValue) {
        const searchObject = { ...props.searchObject };
        if (props?.labelSearch) searchObject[props?.labelSearch] = keyword;

        setIsLoading(true);
        const data = await getData(searchObject);
        setPageIndex(props.searchObject?.pageIndex || 1);
        setOptionList(data);
        setIsCheckDataScroll(data?.length > 0);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Xảy ra lỗi, vui lòng thử lại!");
    }
  };

  const customFilterOption = (option: any, inputValue: any) => {
    const label = String(option.label).toLowerCase();
    const input = String(inputValue).toLowerCase();
    return removeDiacritics(label).includes(removeDiacritics(input));
  };

  return (
    <div className={props.horizontal ? "flex" : ""}>
      <span className={`
        text-lable-input lable
        ${props?.formCheckBox ? "flex flex-middle justify-content-between" : ""}
      `}>
        <label>
          {props?.lable}
          {props?.isRequired && <span className="color-red"> *</span>}
        </label>
        {
          props?.formCheckBox && (
            <div className="flex">
              <span>{lang("GENERAL.OTHER")}</span>
              <Form.Check
                disabled={props?.isReadOnly}
                className="checkBox check-box-autoComplete"
                name="isCheckBox"
                checked={props?.isCheckBox}
                onChange={handleCheckbox}
              />
            </div>
          )
        }
      </span>
      {
        props?.isCheckBox
          ? <TextValidator
            name={props?.name || ""}
            value={props?.value || ""}
            onChange={props?.onChange}
            touched={props.touched}
            errors={props.errors}
            readOnly={props?.isReadOnly}
          />
          : <Select
            getOptionLabel={(option: GetOptionLabel<any>) =>
              props.getOptionLabel
                ? props.getOptionLabel(option)
                : option.name
            }
            getOptionValue={(option: any) =>
              props.getOptionValue
                ? props.getOptionValue(option)
                : option?.value
            }
            backspaceRemovesValue={props?.backspaceRemovesValue}
            options={optionList}
            noOptionsMessage={({ inputValue }) => props?.isAddNew
              ? <button className="button-primary w-100" onClick={props?.onAddNew}>Thêm mới</button>
              : <span>Không tìm thấy lựa chọn cho {inputValue}</span>
            }
            className={combinedClassName}
            name={props?.name}
            value={selectedValue}
            id={props?.id}
            key={props?.key}
            onFocus={() => setIsFocus(true)}
            onBlur={handleBlur}
            isDisabled={props?.isDisabled}
            isLoading={isLoading}
            styles={combinedStyles}
            minMenuHeight={props?.minMenuHeight}
            maxMenuHeight={props?.maxMenuHeight}
            placeholder={
              <p className="color-placeholder spaces fs-13 m-0">
                {/* {props?.placeholder || `Chọn ${props?.lable ? props?.lable?.toLowerCase() : ""}...`} */}
                {props?.placeholder || `Chọn ...`}
              </p>
            }
            onChange={handleChange}
            menuPortalTarget={props?.menuPortalTarget}
            isMulti={props?.isMulti}
            closeMenuOnSelect={props?.closeMenuOnSelect}
            menuPlacement={props?.menuPlacement ? props?.menuPlacement : "auto"}
            onMenuScrollToBottom={props?.isScroll ? handleScrollToBottom : undefined}
            onKeyDown={handleKeyDown}
            onInputChange={handleInputChange}
            hideSelectedOptions={props?.isReadOnly}
            menuIsOpen={props?.isReadOnly ? false : undefined}
            isSearchable={props?.isReadOnly ? false : props?.isSearchable !== undefined ? props?.isSearchable : true}
            isClearable={props?.isReadOnly ? false : (props?.isClearable !== undefined ? props?.isClearable : true)}
            filterOption={customFilterOption}
          />
      }
      {props.touched && props.errors && <div className="invalid-feedback">{props.errors}</div>}
    </div>
  );
};
export default Autocomplete;
import { useIntl } from "react-intl";
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { downLoadFileById, fileUpload } from "../../utils/FileServices";
import { toast } from "react-toastify";
import { actualFileType } from "./constant";
import clsx from "clsx";
import AppContext from "~/app/AppContext";
import CustomTooltip from "../CustomTooltip";

type IProps = {
  label: string;
  required?: boolean;
  setValue: (data: string) => void;
  fileValue: string;
  allowFileTypes: string;
  errors?: string;
  touched?: any;
  isReadOnly?: boolean;
};

function UploadFile(props: IProps) {
  const { label, required, setValue, fileValue, errors, touched, allowFileTypes, isReadOnly } = props;
  const intl = useIntl();
    const { setPageLoading } = useContext(AppContext);
    const [selectedFile, setSelectedFile] = useState<string>("");
  const allowedFileTypes = allowFileTypes.split(",").map((type) => type.trim());

  useEffect(() => {
    setSelectedFile(fileValue);
  }, [fileValue])

  const onChange = async (e: any) => {
    const file = e.target.files[0];
    if(file) {
      setPageLoading(true);
      const isValidMaxSize = file.size > 10048576;
      const isValidFileType = actualFileType.find((item) => allowedFileTypes.includes(item.id) && item.value === file.type);
      if (!isValidFileType) {
        toast.error(intl.formatMessage({ id: "TOAST.ERROR.FORMAT.FILE" }));
        return;
      }
      if (isValidMaxSize) {
        toast.error(intl.formatMessage({ id: "TOAST.ERROR.LARGE.FILE" }))
        return;
      }
      try {
        const { data: { data }} = await fileUpload(file);

        setSelectedFile(data?.secure_url);
        setValue(data?.secure_url);
      } catch (error) {
        toast.error(intl.formatMessage({ id: "GENERAL.ERROR" }));
      }finally{
        setPageLoading(false);
      }
    }
  };
  // const handleDownLoadFile = async (file: string) => {
  //   try {
  //     const res = await downLoadFileById(file.id);
  //     const url = window.URL.createObjectURL(new Blob([res?.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `${file.name}`);
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     toast.error(intl.formatMessage({ id: "GENERAL.ERROR" })); 
  //   }
  // };

  return (
    <>
      <div className="text-lable-input lable">
        <span>{label}</span>
        {required && <span className="color-red"> *</span>}
      </div>
      <div className={clsx(
        "custom-file-upload gap-2",
        { "form-control is-invalid": errors && touched },
        { "disabled": isReadOnly }
      )}>
        <CustomTooltip
          title="Chọn file"
          placement="auto"
          className={clsx(
            { "hidden": isReadOnly }
          )}
        >
          <label 
            className={clsx("flex flex-middle flex-shrink-1 flex-grow-0 overflow-hidden",
              { "cursor-pointer": !isReadOnly }
            )}
          >
            <input type="file" onChange={onChange} accept={allowFileTypes} readOnly={isReadOnly} disabled={isReadOnly} />
            <div className="icon-upload-file">
              <i className="fa fa-cloud-upload text-primary me-1" />{intl.formatMessage({ id: "SELECT.FILE" })}
            </div>
            <span className="file-preview">
              {selectedFile || ""}
            </span>
          </label>
        </CustomTooltip>
        {/* <CustomTooltip
          title={lang("DOWNLOAD.FILE")}
          placement="right"
          className={clsx(
            { "hidden": isReadOnly || !selectedFile.id }
          )}
        >
          <div
            className={clsx(
              "bi bi-download",
              { "cursor-pointer": !isReadOnly && selectedFile.id}
            )}
            onClick={() => !isReadOnly && selectedFile.id && handleDownLoadFile(selectedFile)}
          ></div>
        </CustomTooltip> */}
      </div>
      {errors && touched && <div className='invalid-feedback'>{errors}</div>}
    </>
  );
}

export default UploadFile;

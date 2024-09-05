import { ChangeEvent, useContext, useState } from "react";
import { Col, Form, Image, Row } from "react-bootstrap";
import { useIntl } from "react-intl";
import { imageUpload } from "../../utils/FileServices";
import { toast } from "react-toastify";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE } from "../../utils/Constant";
type IProps = {
  handleUploadAvatar: (url: string) => void;
  allowFileTypes?: string;
};
function ImageUpload(props: IProps) {
  const { handleUploadAvatar, allowFileTypes } = props;
  const { setPageLoading } = useContext(AppContext);
  const intl = useIntl();
  const handleChangeImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target?.files) {
      setPageLoading(true);
      const file = event.target.files[0];
      try {
        const { data } = await imageUpload(file);
        if(data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
          handleUploadAvatar(data?.data?.secure_url);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        toast.error(intl.formatMessage({ id: "GENERAL.ERROR" }));
      } finally{
        event.target.value = "";
        setPageLoading(false);
      }

    }
  };
  return (
    <>
      <label className="cursor-pointer image-upload">
        <i className="bi bi-camera icon-image-upload text-primary fs-1"></i>
        <Form.Control
          type="file"
          size="sm"
          id="select-file-inp"
          className="d-none"
          onChange={handleChangeImage}
          accept={allowFileTypes}
        />
      </label>
    </>
  );
}

export default ImageUpload;

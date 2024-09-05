import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import { useIntl } from "react-intl";
import { imageUpload } from "../../utils/FileServices";
import { toast } from "react-toastify";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { localStorageItem } from "../../utils/LocalStorage";
import { headerConstant } from "../../../../_metronic/layout/components/header/header-menus/constant";
import { hasRole } from "../../utils/FunctionUtils";
import { ROLE } from "../../../constants/Common";
import CustomTooltip from "../CustomTooltip";
import AppContext from "~/app/AppContext";
type IProps = {
  view: boolean;
  url: string;
  handleUploadImage?: (url: string) => void;
  allowFileTypes?: string;
  className?: string;
  imgClassName?: string;
  isAvatar?: boolean;
};
function ImageUploadV2(props: IProps) {
  const { view, handleUploadImage, url, allowFileTypes, className, isAvatar, imgClassName } = props;
  const intl = useIntl();
  const [imageURL, setImageURL] = useState<string>("");
  const { setPageLoading } = useContext(AppContext);

  useEffect(() => {
    if (!url) return;
    setImageURL(url);
  }, [url]);

  const handleChangeImage = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target?.files) {
        setPageLoading(true);
        const src = URL.createObjectURL(event.target.files[0]);
        setImageURL(src);
        const files = event.target.files[0];
        const data = await imageUpload(files);
        if (handleUploadImage) {
          handleUploadImage(data?.data?.data?.secure_url);
          hasRole([ROLE.USER]) && localStorageItem.set(headerConstant.URL_IMAGE_AVATAR, data?.data?.data?.filePath || "");
        }
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "GENERAL.ERROR" }));
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <label className={`cursor-pointer ${className}`} title="Bấm vào đây để thay đổi ảnh">
      <Image src={imageURL || toAbsoluteUrl("/media/avatars/blank.png")} fluid className={`rect-img ${imgClassName} ${!isAvatar ? 'rounded' : 'rounded-circle'}`} />
      <Form.Control
        disabled={view}
        type="file"
        size="sm"
        id="select-file-inp"
        className="d-none"
        onChange={handleChangeImage}
        accept={allowFileTypes}
      />
      {!view && (
        <i className="bi bi-camera image-upload-icon text-white fs-1"></i>
      )}
    </label>
  );
}

export default ImageUploadV2;

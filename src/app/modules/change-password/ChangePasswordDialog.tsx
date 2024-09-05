import { Button, Modal, Row, Col, Form } from "react-bootstrap";
import useMultiLanguage from "../../hook/useMultiLanguage";
import TextValidator from "../component/input-field/TextValidator";
import { useFormik } from "formik";
import "./change-password.scss";
import { IChangePassword } from "./model/changePasswordModel";
import * as Yup from "yup";
import AppContext from "../../AppContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import { changePassword } from "./services/changePasswordServices";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { useAuth } from "../auth";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const INIT_CHANGE_PASSWORD: IChangePassword = {
  password: "",
  oldPassword: "",
  confirmPassword: ""
};

function ChangePasswordDialog(props: Props) {
  const { open, handleClose } = props;
  const { lang } = useMultiLanguage();
  const { setPageLoading } = useContext(AppContext);
  const { logout } = useAuth();

  const handleSubmit = async (values: IChangePassword) => {
    try {
      setPageLoading(true);
      const { data } = await changePassword(values);
      if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
        toast.success(lang("TOAST.CHANGE_PASS_SUCCESS"));
        logout();
      }else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(lang(lang("GENERAL.ERROR")));
    } finally {
      setPageLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(lang("VALIDATION.REQUIRE")).nullable(),
    password: Yup.string().required(lang("VALIDATION.REQUIRE")).min(8, lang("REQUIRE_8")).nullable(),
    confirmPassword: Yup.string()
      .required(lang("VALIDATION.REQUIRE"))
      .oneOf([Yup.ref("password")], lang("PASSWORD_INVALID"))
      .nullable()
  });

  const formik = useFormik({
    initialValues: INIT_CHANGE_PASSWORD,
    onSubmit: handleSubmit,
    validationSchema
  });

  return (
    <Modal
      show={open}
      onHide={handleClose}
      size="sm"
      centered
      className="modal-change-password"
    >
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="spaces fs-20 fw-500">{lang("USER.CHANGEPASSWORD")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="overflow-y-auto">
          <Row className="spaces ">
            <Col xs={12}>
              <TextValidator
                lable={lang("AUTH.OLD_PASSWORD")}
                name="oldPassword"
                type="password"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                errors={formik.errors?.oldPassword}
                touched={formik.touched?.oldPassword}
              />
            </Col>
            <Col
              xs={12}
              className="spaces pt-8"
            >
              <TextValidator
                lable={lang("AUTH.NEW_PASSWORD")}
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                errors={formik.errors?.password}
                touched={formik.touched?.password}
              />
            </Col>
            <Col
              xs={12}
              className="spaces pt-8"
            >
              <TextValidator
                lable={lang("AUTH.RETYPE_NEW_PASSWORD")}
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                errors={formik.errors?.confirmPassword}
                touched={formik.touched?.confirmPassword}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            className="btn btn-secondary btn-sm"
            onClick={handleClose}
          >
            {lang("BTN.CANCEL")}
          </Button>
          <Button
            className="btn btn-primary btn-sm"
            type="submit"
          >
            {lang("BTN.SAVE")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ChangePasswordDialog;

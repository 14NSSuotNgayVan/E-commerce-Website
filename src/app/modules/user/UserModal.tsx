import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initUser } from "./consts/UserConst";
import TextValidator from "../component/input-field/TextValidator";
import { REGEX, RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addUser, updateUser } from "./services/UserServices";
import Autocomplete from "../component/input-field/Autocomplete";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import { INITIAL_SEARCH_OBJECT } from "../constant";
import { searchRole } from "../roles/services/RoleServices";
import { IUser } from "./models/UserModel";
import { IRole } from "../roles/models/RoleModel";

function UserModal(props: any) {
    const {
        isShowModal,
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);
    const [optionsRole, setOptionsRole] = useState<IRole[]>([]);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .matches(REGEX.CHARACTER255, lang("VALIDATION.MAX255"))
            .required(lang("VALIDATION.REQUIRE")),
        email: Yup.string().email(lang("VALIDATION.EMAIL_INVALID"))
            .required(lang("VALIDATION.REQUIRE")),
        password: !item?.id ? Yup.string()
            .matches(REGEX.USER_PASSWORD, "Mật khẩu không đúng định dạng")
            .required('Mật khẩu là bắt buộc') : Yup.string(),
        confirmPassword: !item?.id
            ? Yup.string()
                .required(lang("VALIDATION.REQUIRE"))
                .oneOf([Yup.ref("password")], lang("PASSWORD_INVALID"))
            : Yup.mixed().nullable(),
        role: Yup.object().required(lang("VALIDATION.REQUIRE"))
    });

    const handleSubmit = async (values: IUser) => {
        try {
            setPageLoading(true);
            const updateData = {
                ...values,
                role: values.role?.name,
                verified: true,
            }
            const data = await (!values?.id ? addUser(updateData) : updateUser(updateData));

            if (data?.data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Thành công!");
                handleClose();
                handleSearch();
                return;
            }
            toast.error(data?.data?.message);
        } catch {
            toast.error("Không thành công!");
        } finally {
            setPageLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: initUser,
        validationSchema,
        onSubmit: handleSubmit,
    });

    const handleSelect = (name: string, value: any) => {
        formik.setFieldValue(name, value)
    }

    const handleClose = () => {
        formik.resetForm();
        handleCloseModal();
    }

    useEffect(() => {
        item && formik.setValues({ ...formik.values, ...item });
    }, [item]);

    useEffect(() => {
        if(item && optionsRole && optionsRole?.length > 0) {
            const role = optionsRole.find((role: IRole) => role?.name === item?.role);
            formik.setFieldValue("role", role)
        }
    }, [item, optionsRole]);

    const getOptionsRole = async (searchObject: any) => {
        try {
            const { data } = await searchRole(searchObject);
            if(data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setOptionsRole(data?.data?.content);
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error("Xảy ra lỗi, vui lòng thử lại sau");
        }
    }

    useEffect(() => {
        getOptionsRole(INITIAL_SEARCH_OBJECT);
    }, []);

    return (
        <Modal
            show={isShowModal}
            size="lg"
            centered
            aria-labelledby="example-custom-modal-styling-title"
            onHide={handleClose}
        >
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title
                        id="example-custom-modal-styling-title"
                        className="heading-5"
                    >
                        {lang(`${formik.values?.id ? 'GENERAL.UPDATE' : 'GENERAL.ADD'}`)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Row className="p-2">
                        <Col sm={6}>
                            <TextValidator
                                className="flex-row min-w-80"
                                isRequired
                                lable={"Tên người dùng"}
                                name="username"
                                value={formik.values?.username || ""}
                                type="text"
                                errors={formik.errors?.username}
                                touched={formik.touched?.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Col>
                        <Col sm={6}>
                            <TextValidator
                                className="flex-row min-w-80"
                                isRequired
                                lable={"Email"}
                                name="email"
                                value={formik.values?.email || ""}
                                type="text"
                                errors={formik.errors?.email}
                                touched={formik.touched?.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </Col>
                        {!item?.id && (
                            <>
                                <Col
                                    sm={6}
                                    className="pt-4"
                                >
                                    <TextValidator
                                        name="password"
                                        lable={lang("USER.PASSWORD")}
                                        type={"password"}
                                        onChange={formik.handleChange}
                                        value={formik?.values?.password}
                                        touched={formik?.touched?.password}
                                        errors={formik?.errors?.password}
                                        isRequired
                                    />
                                </Col>
                                <Col
                                    sm={6}
                                    className="pt-4"
                                >
                                    <TextValidator
                                        name="confirmPassword"
                                        lable={lang("USER.RE_PASSWORD")}
                                        type={"password"}
                                        onChange={formik.handleChange}
                                        value={formik?.values?.confirmPassword}
                                        touched={formik?.touched?.confirmPassword}
                                        errors={formik?.errors?.confirmPassword}
                                        isRequired
                                    />
                                </Col>
                            </>
                        )}
                        <Col sm={6} className="pt-4">
                            <Autocomplete
                                isRequired
                                className="spaces z-index-8 width-100"
                                lable={"Quyền hạn: "}
                                options={optionsRole}
                                value={formik.values?.role}
                                name={"role"}
                                onChange={(selectedOption) => handleSelect("role", selectedOption)}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.role}
                                touched={formik.touched?.role}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="flex-center">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>{lang("BTN.CANCEL")}</button>
                    <button type="submit" className="btn btn-primary">{lang("BTN.SAVE")}</button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
export { UserModal };
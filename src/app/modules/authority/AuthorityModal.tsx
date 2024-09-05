import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initAuthority } from "./consts/AuthorityConst";
import TextValidator from "../component/input-field/TextValidator";
import { REGEX, RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addAuthority, updateAuthority } from "./services/AuthorityServices";


function AuthorityModal(props: any) {
    const {
        isShowModal,
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        code: Yup.string()
            .matches(REGEX.CHARACTER255, lang("VALIDATION.MAX255"))
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        name: Yup.string()
            .matches(REGEX.CHARACTER255, lang("VALIDATION.MAX255"))
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
    });

    const handleSubmit: any = async () => {
        try {
            setPageLoading(true);
            const data = await (!formik.values?.id ? addAuthority(formik.values) : updateAuthority(formik.values));

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

    const handleClose = () => {
        formik.resetForm();
        handleCloseModal();
    }

    const formik = useFormik({
        initialValues: initAuthority,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        item && formik.setValues({ ...formik.values, ...item });
    }, [item]);


    useEffect(() => {
        formik.setFieldValue("name", formik.values?.code);
    }, [formik.values?.code]);

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
                                lable={"Mã quyền"}
                                name="code"
                                value={formik.values?.code || ""}
                                type="text"
                                errors={formik.errors?.code}
                                touched={formik.touched?.code}
                                onChange={formik.handleChange}
                            />
                        </Col>
                        <Col sm={6}>
                            <TextValidator
                                className="flex-row min-w-80"
                                isRequired
                                lable={"Tên quyền"}
                                name="name"
                                value={formik.values?.name || ""}
                                type="text"
                                errors={formik.errors?.name}
                                touched={formik.touched?.name}
                                onChange={formik.handleChange}
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
export { AuthorityModal };
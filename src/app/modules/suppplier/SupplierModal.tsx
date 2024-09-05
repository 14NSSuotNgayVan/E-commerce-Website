import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initSupplier } from "./consts/SupplierConst";
import TextValidator from "../component/input-field/TextValidator";
import { REGEX, RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addSupplier, updateSupplier } from "./services/SupplierServices";


function SupplierModal(props: any) {
    const {
        isShowModal,
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        tenNhaCungCap: Yup.string()
            .matches(REGEX.CHARACTER255, lang("VALIDATION.MAX255"))
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        diaChi: Yup.string().required(lang("VALIDATION.REQUIRE")),
        email: Yup.string().required(lang("VALIDATION.REQUIRE")),
        soDienThoai: Yup.string().matches(REGEX.CHECK_PHONE, lang("VALIDATION.ISPHONE")),
    });

    const handleSubmit: any = async () => {
        try {
            setPageLoading(true);
            const data = await (!formik.values?.id ? addSupplier(formik.values) : updateSupplier(formik.values));

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
        initialValues: initSupplier,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        item && formik.setValues({ ...formik.values, ...item });
    }, [item]);

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
                                lable={"Tên NCC"}
                                name="tenNhaCungCap"
                                value={formik.values?.tenNhaCungCap || ""}
                                type="text"
                                errors={formik.errors?.tenNhaCungCap}
                                touched={formik.touched?.tenNhaCungCap}
                                onChange={formik.handleChange}
                            />
                        </Col>

                        <Col sm={6}>
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={"Số điện thoại"}
                                name="soDienThoai"
                                value={formik.values?.soDienThoai || ""}
                                type="text"
                                errors={formik.errors?.soDienThoai}
                                touched={formik.touched?.soDienThoai}
                                onChange={formik.handleChange}
                            />
                        </Col>
                    </Row>
                    <Row className="p-2">

                        <Col sm={6}>
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={"Email"}
                                isRequired
                                name="email"
                                value={formik.values?.email || ""}
                                type="text"
                                errors={formik.errors?.email}
                                touched={formik.touched?.email}
                                onChange={formik.handleChange}
                            />
                        </Col>
                        <Col sm={6}>
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={"Địa chỉ"}
                                isRequired
                                name="diaChi"
                                value={formik.values?.diaChi || ""}
                                type="text"
                                errors={formik.errors?.diaChi}
                                touched={formik.touched?.diaChi}
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
export { SupplierModal };
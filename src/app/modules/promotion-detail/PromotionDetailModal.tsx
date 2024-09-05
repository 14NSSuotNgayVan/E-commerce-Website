import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initPromotionDetail } from "./consts/PromotionDetailConst";
import TextValidator from "../component/input-field/TextValidator";
import { REGEX, RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addPromotionDetail, updatePromotionDetail } from "./services/PromotionDetailServices";
import { searchUser } from "../user/services/UserServices";
import { INITIAL_SEARCH_OBJECT, priceUnitDefault } from "../constant";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import Autocomplete from "../component/input-field/Autocomplete";
import { INITIAL_SEARCH_EMPTY_USER, INITIAL_SEARCH_USER } from "../user/consts/UserConst";
import { convertNumberPrice, convertTextPrice, dateVNToDate, formatDateTimeInput, formatDateVN } from "../utils/FunctionUtils";
import { searchCategory } from "../category/services/CategoryServices";
import { searchColor } from "../color/services/ColorServices";
import { searchSize } from "../size/services/SizeServices";
import { searchProduct } from "../product/services/ProductServices";
import { IPromotionDetail } from "./models/PromotionDetailModel";


function PromotionDetailModal(props: any) {
    const {
        isShowModal,
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        product: Yup.object()
            .required(lang("VALIDATION.REQUIRE")),
        giaKhuyenMai: Yup.number()
            .required(lang("VALIDATION.REQUIRE")),
    });

    const handleSubmit = async (values: IPromotionDetail) => {
        try {
            setPageLoading(true);
            const updateData = {
                ...values,
                maSanPham: values?.product?.id
            }

            const data = await (!values?.id ? addPromotionDetail(updateData) : updatePromotionDetail(updateData));

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

    const handleSelect = (name: string, value: any) => {
        formik.setFieldValue(name, value)
    }

    const handleClose = () => {
        formik.resetForm();
        handleCloseModal();
    }

    const formik = useFormik({
        initialValues: initPromotionDetail,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleChangeMoney = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        formik.setFieldValue(name, convertTextPrice(value));
    };

    useEffect(() => {
        item && formik.setValues({ ...formik.values, ...item });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <Autocomplete
                                className="spaces z-index-10 width-100"
                                lable={"Sản phẩm"}
                                options={[]}
                                isRequired
                                searchFunction={searchProduct}
                                searchObject={INITIAL_SEARCH_OBJECT}
                                value={formik.values?.product}
                                name={"product"}
                                onChange={(selectedOption) => handleSelect("product", selectedOption)}
                                getOptionLabel={(option) => option?.tenSanPham}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.product}
                                touched={formik.touched?.product}
                            />
                        </Col>
                        <Col sm={3}>
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={`Giá hiện tại (${priceUnitDefault})`}
                                name="giaTien"
                                value={convertNumberPrice(formik.values?.product?.giaTien || "")}
                                type="text"
                                onChange={handleChangeMoney}
                                disabled
                            />
                        </Col>
                        <Col sm={3}>
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={`Giá khuyến mãi (${priceUnitDefault})`}
                                isRequired
                                name="giaKhuyenMai"
                                value={convertNumberPrice(formik.values?.giaKhuyenMai)}
                                type="text"
                                errors={formik.errors?.giaKhuyenMai}
                                touched={formik.touched?.giaKhuyenMai}
                                onChange={handleChangeMoney}
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
export { PromotionDetailModal };
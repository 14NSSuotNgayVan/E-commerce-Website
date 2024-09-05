import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {  Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initProductDetail } from "./consts/ProductDetailConst";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addProductDetail, updateProductDetail } from "./services/ProductDetailServices";
import { INITIAL_SEARCH_OBJECT, TYPE_IMAGE } from "../constant";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import Autocomplete from "../component/input-field/Autocomplete";
import { searchColor } from "../color/services/ColorServices";
import { searchSize } from "../size/services/SizeServices";
import ImageUploadV2 from "../component/ImageUpload/ImageUploadV2";


function ProductDetailModal(props: any) {
    const {
        isShowModal,
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        size: Yup.object()
            .required(lang("VALIDATION.REQUIRE")),
        color: Yup.object()
            .required(lang("VALIDATION.REQUIRE")),
        hinhAnh: Yup.string().nullable(),
    });

    const handleSubmit: any = async () => {
        try {
            setPageLoading(true);
            const updateData = {
                ...formik.values,
                maMau: formik.values.color?.id,
                maKichThuoc: formik.values.size?.id,
            }

            const data = await (!formik.values?.id ? addProductDetail(updateData) : updateProductDetail(updateData));

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
        initialValues: initProductDetail,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

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
                        <Col sm={3} className="text-center">
                            <p className="text-lable-input lable flex-center">Hình ảnh</p>
                            <ImageUploadV2 className="spaces max-h-150 max-w-150" handleUploadImage={(url: string) => formik.setFieldValue("hinhAnh", url)} url={formik.values?.hinhAnh || ""} view={false} allowFileTypes={TYPE_IMAGE.join(",")} />
                        </Col>
                        <Col sm={9} className="pt-9">
                            <Autocomplete
                                className="spaces z-index-10 width-100 mb-10"
                                lable={"Màu"}
                                options={[]}
                                isRequired
                                searchFunction={searchColor}
                                searchObject={INITIAL_SEARCH_OBJECT}
                                value={formik.values?.color}
                                name={"color"}
                                onChange={(selectedOption) => handleSelect("color", selectedOption)}
                                getOptionLabel={(option) => option?.tenMau}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.color}
                                touched={formik.touched?.color}
                            />
                            <Autocomplete
                                className="spaces z-index-8 width-100 mb-8"
                                lable={"Kích cỡ"}
                                options={[]}
                                isRequired
                                searchFunction={searchSize}
                                searchObject={INITIAL_SEARCH_OBJECT}
                                value={formik.values?.size}
                                name={"size"}
                                onChange={(selectedOption) => handleSelect("size", selectedOption)}
                                getOptionLabel={(option) => option?.tenKichThuoc}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.size}
                                touched={formik.touched?.size}
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
export { ProductDetailModal };
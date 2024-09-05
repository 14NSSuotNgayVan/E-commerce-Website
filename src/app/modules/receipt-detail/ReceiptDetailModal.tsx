import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initReceiptDetail } from "./consts/ReceiptDetailConst";
import TextValidator from "../component/input-field/TextValidator";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addReceiptDetail, updateReceiptDetail } from "./services/ReceiptDetailServices";
import { INITIAL_SEARCH_OBJECT, TYPE_IMAGE, priceUnitDefault } from "../constant";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import Autocomplete from "../component/input-field/Autocomplete";
import { convertNumberPrice, convertTextPrice, filterObject, justAllowNumber } from "../utils/FunctionUtils";
import { searchProduct } from "../product/services/ProductServices";
import { searchProductDetail } from "../product-detail/services/ProductDetailServices";
import { IProductDetail } from "../product-detail/models/ProductDetailModel";
import { IReceiptDetail } from "./models/ReceiptDetailModel";


function ReceiptDetailModal(props: any) {
    const {
        isShowModal,
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        id: Yup.string()
            .nullable(),
        maChiTietSanPham: Yup.string(),
        productDetail: Yup.object()
            .required(lang("VALIDATION.REQUIRE")),
        product: Yup.object()
            .required(lang("VALIDATION.REQUIRE")),
        soLuongNhap: Yup.number()
            .required(lang("VALIDATION.REQUIRE")),
        giaNhap: Yup.number()
            .required(lang("VALIDATION.REQUIRE")),
    });

    const handleSubmit = async (values: IReceiptDetail) => {
        try {
            setPageLoading(true);
            const updateData = {
                ...values,
                maChiTietSanPham: values.productDetail?.id,
                maSanPham : values?.product?.id
            }

            const data = await (!values?.id ? addReceiptDetail(filterObject(updateData)) : updateReceiptDetail(filterObject(updateData)));

            if (data?.data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Thành công!");
                handleSearch();
                handleClose();
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
        switch (name) {
            case "product":
                formik.setFieldValue("productDetail", null);
                formik.setFieldValue(name, value)
                break;
            case "productDetail":
                formik.setFieldValue(name, value)
                break;
            default:
                break;
        }
    }

    const handleClose = () => {
        formik.resetForm();
        handleCloseModal();
    }

    const formik = useFormik({
        initialValues: initReceiptDetail,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        item && formik.setValues({
            ...formik.values,
            ...item,
            product: item?.productDetail?.product,
            productDetail: item?.productDetail,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const handleChangeMoney = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        formik.setFieldValue(name, convertTextPrice(value));
    };

    const handleChangePositiveNumber = (event: React.ChangeEvent<any>) => {
        if (!event.target?.value?.startsWith("0")) {
          formik.handleChange(event);
        }
    };

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
                <Modal.Body className="p-4 column-gap-1">
                    <Row className="mb-3">
                        <Col sm={6}>
                            <Autocomplete
                                className="spaces z-index-10 width-100"
                                lable={"Sản phẩm"}
                                options={[]}
                                isRequired
                                searchFunction={searchProduct}
                                searchObject={INITIAL_SEARCH_OBJECT}
                                value={formik.values?.product || null}
                                name={"product"}
                                onChange={(selectedOption) => handleSelect("product", selectedOption)}
                                getOptionLabel={(option) => option?.tenSanPham}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.product}
                                touched={formik.touched?.product}
                            />
                        </Col>
                        <Col sm={6}>
                            <Autocomplete
                                className="spaces z-index-8 width-100"
                                lable={"Loại"}
                                options={[]}
                                isRequired
                                searchFunction={searchProductDetail}
                                searchObject={{ pageSize: 999, pageIndex: 1, maSanPham: formik.values?.product?.id }}
                                value={formik.values?.productDetail || null}
                                name={"productDetail"}
                                onChange={(selectedOption) => handleSelect("productDetail", selectedOption)}
                                valueSearch={"id"}
                                getOptionLabel={(option: IProductDetail) => option?.size?.tenKichThuoc && option?.color?.tenMau ? `Màu ${option?.color?.tenMau} - Size ${option?.size?.tenKichThuoc}` : ''}
                                getOptionValue={(option: any) => option}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.productDetail}
                                touched={formik.touched?.productDetail}
                                dependencies={[formik.values?.product?.id]}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={"Số lượng tồn kho"}
                                isRequired
                                value={formik.values?.productDetail?.soLuong ?? ""}
                                type="number"
                                readOnly
                            />
                        </Col>
                        <Col sm={4}>
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={"Số lượng nhập"}
                                isRequired
                                name="soLuongNhap"
                                value={formik.values?.soLuongNhap || ""}
                                type="number"
                                onKeyDown={justAllowNumber}
                                errors={formik.errors?.soLuongNhap}
                                touched={formik.touched?.soLuongNhap}
                                onChange={handleChangePositiveNumber}
                            />
                        </Col>
                        <Col sm={4}>
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={`Giá nhập (${priceUnitDefault})`}
                                isRequired
                                name="giaNhap"
                                value={convertNumberPrice(formik.values?.giaNhap)}
                                type="text"
                                errors={formik.errors?.giaNhap}
                                touched={formik.touched?.giaNhap}
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
export { ReceiptDetailModal };
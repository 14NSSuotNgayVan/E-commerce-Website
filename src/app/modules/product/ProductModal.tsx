import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initProduct } from "./consts/ProductConst";
import TextValidator from "../component/input-field/TextValidator";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addProduct, updateProduct } from "./services/ProductServices";
import { INITIAL_SEARCH_OBJECT, TYPE_IMAGE, priceUnitDefault } from "../constant";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import Autocomplete from "../component/input-field/Autocomplete";
import { convertNumberPrice, convertTextPrice, filterObject } from "../utils/FunctionUtils";
import ProductDetail from "../product-detail/ProductDetail";
import { KTSVG } from "~/_metronic/helpers";
import { searchCategory } from "../category/services/CategoryServices";
import ImageUploadV2 from "../component/ImageUpload/ImageUploadV2";
import { IProduct } from "./models/ProductModel";


function ProductModal(props: any) {
    const {
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        id: Yup.string()
            .nullable(),
        category: Yup.object()
            .required(lang("VALIDATION.REQUIRE")),
        tenSanPham: Yup.string()
            .required(lang("VALIDATION.REQUIRE")),
        hinhAnh: Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        moTa: Yup.string().nullable(),
        giaTien: Yup.number().required(lang("VALIDATION.REQUIRE")),
    });

    const handleSubmit = async (values: IProduct) => {
        try {
            setPageLoading(true);
            const updateData = {
                ...values,
                maLoaiSanPham: values.category?.id
            }
            const data = await (!values?.id ? addProduct(filterObject(updateData)) : updateProduct(filterObject(updateData)));

            if (data?.data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Thành công!");
                handleSearch();
                !values?.id ? formik.setFieldValue("id", data.data?.data.id) : handleClose();
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
        initialValues: initProduct,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        item && formik.setValues({ ...formik.values, ...item });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const handleChangeMoney = (event: React.ChangeEvent<any>) => {
        const { name, value } = event.target;
        formik.setFieldValue(name, convertTextPrice(value));
    };
    
    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Row className="pt-3 pb-8">
                    <h3 className="text-center">{lang(`${formik.values?.id ? 'GENERAL.UPDATE' : 'GENERAL.ADD'}`)}</h3>
                    <div className="flex flex-space-between bg-white p-2 pb-4">
                        <div className="spaces d-flex align-items-center cursor-pointer w-110" onClick={handleClose}>
                            <KTSVG
                                path='media/icons/arrow-left-from-line.svg'
                                className="fs-2 me-2 text-primary "
                            />
                            <span className="fs-3 fw-bold">{lang("BTN.BACK")}</span>
                        </div>
                        <div className="">
                            <Button
                                variant="primary"
                                className="button-primary btn-sm spaces mr-4"
                                type="submit"
                            >
                                {lang("BTN.SAVE")}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                className="button-secondary btn-sm"
                                onClick={handleClose}
                            >
                                {lang("BTN.CANCEL")}
                            </Button>
                        </div>
                    </div>
                    <div className="flex row flex-start">
                        <Col sm={3} xl={2} className="flex flex-column flex-center">
                            <p className="text-lable-input lable">Hình ảnh</p>
                            <ImageUploadV2 className="spaces max-h-200 max-w-200" handleUploadImage={(url: string) => formik.setFieldValue("hinhAnh", url)} url={formik.values?.hinhAnh || ""} view={false} allowFileTypes={TYPE_IMAGE.join(",")} />
                            {formik.errors.hinhAnh && formik.touched.hinhAnh && <div className="invalid-feedback">{props.errors}</div>}
                        </Col>                        
                        <Col sm={9} xl={10}>
                            <Row>
                                <Col sm={7} xxl={8}>
                                    <TextValidator
                                        isRequired
                                        lable={"Tên sản phẩm"}
                                        name="tenSanPham"
                                        value={formik.values?.tenSanPham || ""}
                                        type="text"
                                        errors={formik.errors?.tenSanPham}
                                        touched={formik.touched?.tenSanPham}
                                        onChange={formik.handleChange}
                                    />
                                </Col>
                                <Col sm={2} xxl={2}>
                                    <TextValidator
                                        lable={`Giá bán (${priceUnitDefault})`}
                                        name="giaTien"
                                        isRequired
                                        value={convertNumberPrice(formik.values?.giaTien)}
                                        type="text"
                                        errors={formik.errors?.giaTien}
                                        touched={formik.touched?.giaTien}
                                        onChange={handleChangeMoney}
                                    />
                                </Col>
                                <Col sm={3} xxl={2}>
                                    <Autocomplete
                                        className="spaces z-index-8"
                                        lable={"loại sản phẩm"}
                                        options={[]}
                                        isRequired
                                        searchFunction={searchCategory}
                                        searchObject={INITIAL_SEARCH_OBJECT}
                                        value={formik.values?.category}
                                        name={"category"}
                                        onChange={(selectedOption) => handleSelect("category", selectedOption)}
                                        valueSearch={"id"}
                                        getOptionLabel={(option) => option?.tenLoai}
                                        styles={heightSelectMutil("auto", "38px", "100px")}
                                        errors={formik.errors?.category}
                                        touched={formik.touched?.category}
                                    />
                                </Col>
                                <Col sm={12}>
                                    <TextValidator
                                        className="flex-row min-w-80"
                                        as='textarea'
                                        rows={8}
                                        lable={"Mô tả"}
                                        name="moTa"
                                        value={formik.values?.moTa || ""}
                                        type="text"
                                        errors={formik.errors?.moTa}
                                        touched={formik.touched?.moTa}
                                        onChange={formik.handleChange}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </div>
                </Row>
            </Form>
            {formik.values.id && <hr className="spaces my-16 width-94 mx-auto"></hr>}
            {formik.values.id && <Row className="px-8">
                <ProductDetail maSanPham={formik.values.id} />
            </Row>}
        </>
    );
}
export { ProductModal };
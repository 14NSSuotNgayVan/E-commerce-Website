import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { PROMOTION_STATUS_CODE, initPromotion } from "./consts/PromotionConst";
import TextValidator from "../component/input-field/TextValidator";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addPromotion, updatePromotion } from "./services/PromotionServices";
import { checkObject, filterObject } from "../utils/FunctionUtils";
import PromotionDetail from "../promotion-detail/PromotionDetail";
import { KTSVG } from "~/_metronic/helpers";


function PromotionModal(props: any) {
    const {
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        tenKhuyenMai: Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        ngayBatDau: Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        ngayKetThuc: Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
    });

    const handleSubmit: any = async () => {
        try {
            setPageLoading(true);
            const updateData = {
                ...formik.values,
                trangThai : undefined
            }
            const data = await (!formik.values?.id ? addPromotion(filterObject(updateData)) : updatePromotion(filterObject(updateData)));

            if (data?.data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Thành công!");
                handleSearch();
                !formik.values?.id ? formik.setFieldValue("id", data.data?.data.id) : handleClose();
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
        initialValues: initPromotion,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        item && formik.setValues({ ...formik.values, ...item });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    return (
        <>
            <Form onSubmit={formik.handleSubmit}>
                <Row className="p-8">
                    <h3 className="text-center">{lang(`${formik.values?.id ? 'GENERAL.UPDATE' : 'GENERAL.ADD'}`)}</h3>
                    <div className="pb-2 flex flex-space-between bg-white p-2">
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
                    <Col sm={4}>
                        <TextValidator
                            className="flex-row min-w-80"
                            isRequired
                            lable={"Tên khuyến mãi"}
                            name="tenKhuyenMai"
                            value={formik.values?.tenKhuyenMai || ""}
                            type="text"
                            errors={formik.errors?.tenKhuyenMai}
                            touched={formik.touched?.tenKhuyenMai}
                            onChange={formik.handleChange}
                        />
                    </Col>
                    <Col sm={4}>
                        <TextValidator
                            className="flex-row min-w-80"
                            lable={"Ngày bắt đầu"}
                            isRequired
                            name="ngayBatDau"
                            value={formik.values?.ngayBatDau || ""}
                            type="date"
                            errors={formik.errors?.ngayBatDau}
                            touched={formik.touched?.ngayBatDau}
                            onChange={formik.handleChange}
                        />
                    </Col>
                    <Col sm={4}>
                        <TextValidator
                            className="flex-row min-w-80"
                            lable={"Ngày kết thúc"}
                            isRequired
                            name="ngayKetThuc"
                            value={formik.values?.ngayKetThuc || ""}
                            type="date"
                            errors={formik.errors?.ngayKetThuc}
                            touched={formik.touched?.ngayKetThuc}
                            onChange={formik.handleChange}
                        />
                    </Col>
                </Row>
            </Form>
            {formik.values.id && <hr className="spaces my-24 width-94 mx-auto"></hr>}
            {formik.values.id && <Row className="p-8">
                <PromotionDetail maKhuyenMai={formik.values.id} />
            </Row>}
        </>
    );
}
export { PromotionModal };
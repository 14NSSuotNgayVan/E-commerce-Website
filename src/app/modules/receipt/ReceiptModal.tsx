import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initReceipt } from "./consts/ReceiptConst";
import TextValidator from "../component/input-field/TextValidator";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addReceipt, updateReceipt } from "./services/ReceiptServices";
import { INITIAL_SEARCH_OBJECT } from "../constant";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import Autocomplete from "../component/input-field/Autocomplete";
import { handleBlurDate } from "../utils/FunctionUtils";
import { KTSVG } from "~/_metronic/helpers";
import { searchSupplier } from "../suppplier/services/SupplierServices";
import ReceiptDetail from "../receipt-detail/ReceiptDetail";
import { IReceipt } from "./models/ReceiptModel";


function ReceiptModal(props: any) {
    const {
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);
    const [isEnableToApproval, setIsEnableToApproval] = useState<boolean>(false);
    const validationSchema = Yup.object().shape({
        id: Yup.string()
            .nullable(),
        supplier: Yup.object()
            .required(lang("VALIDATION.REQUIRE")),
        tenPhieu: Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        ngayNhap: Yup.date()
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        ghiChu: Yup.string()
    });

    const handleSubmit = async (values: IReceipt) => {
        try {
            setPageLoading(true);
            const updateData = {
                ...values,
                maNhaCungCap: values.supplier?.id
            }
            const data = await (!values?.id ? addReceipt(updateData) : updateReceipt(updateData));
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

    const handleXacNhan = async () => {
        try {
            if (!isEnableToApproval) {
                toast.warning("Vui lòng nhập chi tiết sản phẩm trước khi xác nhận!");
                return;
            }
            setPageLoading(true);
            const data = await updateReceipt({
                ...formik.values,
                xacNhanNhapKho: true,
                maNhaCungCap: formik.values.supplier?.id
            });

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
        initialValues: initReceipt,
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
                    <h3 className="text-center">{lang(`${formik.values?.id ? formik.values.xacNhanNhapKho ? 'GENERAL.VIEW' : 'GENERAL.UPDATE' : 'GENERAL.ADD'}`)}</h3>
                    <div className="pb-2 flex flex-space-between bg-white p-2">
                        <div className="spaces d-flex align-items-center cursor-pointer w-110" onClick={handleClose}>
                            <KTSVG
                                path='media/icons/arrow-left-from-line.svg'
                                className="fs-2 me-2 text-primary "
                            />
                            <span className="fs-3 fw-bold">{lang("BTN.BACK")}</span>
                        </div>
                        <div className="">
                            {!formik.values.xacNhanNhapKho &&
                                <Button
                                    variant="primary"
                                    className="button-primary btn-sm spaces mr-4"
                                    type="submit"
                                >
                                    {lang("BTN.SAVE")}
                                </Button>
                            }
                            {formik.values?.id && !formik.values.xacNhanNhapKho && <Button
                                variant="primary"
                                className="button-primary btn-sm spaces mr-4"
                                onClick={handleXacNhan}
                            >
                                {lang("BTN.CONFIRM")}
                            </Button>}
                            {!formik.values.xacNhanNhapKho &&
                                <Button
                                    variant="outline-secondary"
                                    className="button-secondary btn-sm"
                                    onClick={handleClose}
                                >
                                    {lang("BTN.CANCEL")}
                                </Button>
                            }
                        </div>
                    </div>

                    <Col sm={4}>
                        <TextValidator
                            className="flex-row min-w-80"
                            isRequired
                            lable={"Tên phiếu nhập"}
                            name="tenPhieu"
                            value={formik.values?.tenPhieu || ""}
                            type="text"
                            errors={formik.errors?.tenPhieu}
                            touched={formik.touched?.tenPhieu}
                            onChange={formik.handleChange}
                            readOnly={formik.values.xacNhanNhapKho}
                        />
                    </Col>
                    <Col sm={4}>
                        <Autocomplete
                            isRequired
                            className="spaces z-index-8 width-100"
                            lable={"Nhà cung cấp"}
                            options={[]}
                            searchFunction={searchSupplier}
                            searchObject={INITIAL_SEARCH_OBJECT}
                            value={formik.values?.supplier}
                            name={"supplier"}
                            onChange={(selectedOption) => handleSelect("supplier", selectedOption)}
                            valueSearch={"id"}
                            getOptionLabel={(option) => option?.tenNhaCungCap}
                            styles={heightSelectMutil("auto", "38px", "100px")}
                            errors={formik.errors?.supplier}
                            touched={formik.touched?.supplier}
                            isReadOnly={formik.values.xacNhanNhapKho}
                        />
                    </Col>
                    <Col sm={4}>
                        <TextValidator
                            isRequired
                            className="flex-row min-w-80"
                            lable={"Ngày nhập"}
                            name="ngayNhap"
                            value={formik.values?.ngayNhap}
                            type="date"
                            errors={formik.errors?.ngayNhap}
                            touched={formik.touched?.ngayNhap}
                            onChange={formik.handleChange}
                            onBlur={() =>
                                handleBlurDate(
                                  formik.setFieldValue,
                                  formik.values?.ngayNhap,
                                  "ngayNhap"
                                )
                              }
                            readOnly={formik.values.xacNhanNhapKho}
                        />
                    </Col>
                    <Col sm={12}>
                        <TextValidator
                            className="flex-row min-w-80 mt-2"
                            as='textarea'
                            rows={4}
                            lable={"Ghi chú"}
                            name="ghiChu"
                            value={formik.values?.ghiChu || ""}
                            type="text"
                            errors={formik.errors?.ghiChu}
                            touched={formik.touched?.ghiChu}
                            onChange={formik.handleChange}
                            readOnly={formik.values.xacNhanNhapKho}
                        />
                    </Col>
                </Row>
            </Form >
            {formik.values.id && 
                <>
                    <hr className="spaces my-24 width-94 mx-auto"></hr>
                    <Row className="p-8">
                        <ReceiptDetail maPhieuNhapKho={formik.values.id} xacNhanNhapKho={formik.values.xacNhanNhapKho} setIsEnableToApproval={setIsEnableToApproval} />
                    </Row>
                </>
            }
        </>
    );
}
export { ReceiptModal };
import { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import TextValidator from "../component/input-field/TextValidator";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addReport, updateReport } from "./services/ReportServices";
import { filterObject } from "../utils/FunctionUtils";
import { initReport } from "./consts/ReportConst";
import UploadFile from "../component/FileUpload/UploadFile";


function ReportModal(props: any) {
    const {
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);
    const validationSchema = Yup.object().shape({
        tenBaoCao: Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
            ketQuaPhanTich: Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        file: Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
    });

    const handleSubmit: any = async () => {
        try {
            setPageLoading(true);
            const updateData = {
                ...formik.values,
            }
            const data = await (!formik.values?.id ? addReport(filterObject(updateData)) : updateReport(filterObject(updateData)));

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

    const handleClose = () => {
        formik.resetForm();
        handleCloseModal();
    }

    const formik = useFormik({
        initialValues: initReport,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        item && formik.setValues({ ...formik.values, ...item });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    return (
        <Modal
            show={true}
            size="xl"
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
                    <Row className="p-8">
                        <Col sm={6}>
                            <TextValidator
                                className="flex-row min-w-80"
                                isRequired
                                lable={"Tên báo cáo"}
                                name="tenBaoCao"
                                value={formik.values?.tenBaoCao || ""}
                                type="text"
                                errors={formik.errors?.tenBaoCao}
                                touched={formik.touched?.tenBaoCao}
                                onChange={formik.handleChange}
                            />
                        </Col>
                        <Col sm={6}>
                        <UploadFile 
                            allowFileTypes=".pdf, .docx, .doc, .xlsx, .xls" 
                            fileValue={formik.values?.file} 
                            label="Chọn báo cáo" 
                            setValue={(data)=> formik.setFieldValue("file",data)} 
                            required 
                            errors={formik.errors?.file}
                            touched={formik.touched?.file}
                        />
                        </Col>
                        <Col sm={12} className="pt-3">
                            <TextValidator
                                as='textarea'
                                rows={4}
                                className="flex-row min-w-80"
                                isRequired
                                lable={"Kết quả phân tích"}
                                name="ketQuaPhanTich"
                                value={formik.values?.ketQuaPhanTich || ""}
                                type="text"
                                errors={formik.errors?.ketQuaPhanTich}
                                touched={formik.touched?.ketQuaPhanTich}
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
export { ReportModal };
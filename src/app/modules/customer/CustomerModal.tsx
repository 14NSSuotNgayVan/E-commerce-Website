import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initCustomer } from "./consts/CustomerConst";
import TextValidator from "../component/input-field/TextValidator";
import { REGEX, RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addCustomer, updateCustomer } from "./services/CustomerServices";
import { searchUser } from "../user/services/UserServices";
import { GENDER, INITIAL_SEARCH_OBJECT, TYPE_IMAGE } from "../constant";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import Autocomplete from "../component/input-field/Autocomplete";
import { INITIAL_SEARCH_EMPTY_USER, INITIAL_SEARCH_USER } from "../user/consts/UserConst";
import { dateVNToDate, formatDateTimeInput, formatDateVN } from "../utils/FunctionUtils";
import ImageUploadV2 from "../component/ImageUpload/ImageUploadV2";
import { ICustomer } from "./models/CustomerModel";
import { IUser } from "../user/models/UserModel";

function CustomerModal(props: any) {
    const {
        isShowModal,
        handleCloseModal,
        item,
        handleSearch,
        isInfo
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);
    const [optionUser, setOptionUser] = useState<IUser[]>([]);

    const validationSchema = Yup.object().shape({
        username: !isInfo ? Yup.string()
            .required(lang("VALIDATION.REQUIRE"))
            :  Yup.string().nullable(),
        ngaySinh: Yup.date().required(lang("VALIDATION.REQUIRE")),
        tenKhachHang: Yup.string()
            .matches(REGEX.LETTER_ONLY, lang("VALIDATION.LETTER_ONLY"))
            .required(lang("VALIDATION.REQUIRE")),
        anhDaiDien: Yup.string().nullable(),
        gioiTinh: Yup.object().required(lang("VALIDATION.REQUIRE")),
    });

    const handleSubmit = async (values: ICustomer) => {
        try {
            setPageLoading(true);
            const data = await (!values?.id ? addCustomer(values) : updateCustomer(values));

            if (data?.data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Thành công!");
                handleClose();
                handleSearch(isInfo ? data?.data?.data : undefined);
                return;
            }else toast.error(data?.data?.message);
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
        initialValues: initCustomer,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const getOptionsUser = async (searchObject: any) => {
        try {
            const { data } = await searchUser(searchObject);
            if(data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setOptionUser(data?.data?.content);
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            toast.error("Xảy ra lỗi, vui lòng thử lại sau");
        }
    }

    useEffect(() => {
        item && formik.setValues({
            ...formik.values,
            ...item,
            ngaySinh: formatDateTimeInput(dateVNToDate(item.ngaySinh))
        });
        !isInfo && getOptionsUser({
            ...INITIAL_SEARCH_EMPTY_USER,
            maKhachHang: item?.id
        });
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
                <Modal.Body className="p-4 flex flex-top">
                    <div className="p-2 w-25 flex flex-column row-gap-2 justify-content-center align-items-center">
                        <ImageUploadV2 imgClassName="spaces max-h-150 max-w-150" handleUploadImage={(url: string) => formik.setFieldValue("anhDaiDien", url)} url={formik.values?.anhDaiDien || ""} view={false} allowFileTypes={TYPE_IMAGE.join(",")} />
                        <span className="text-lable-input lable flex-center">Ảnh đại diện</span>
                    </div>
                    <div className="p-2 w-75 flex flex-wrap flex-shrink-0 flex-grow-0">
                        <div className="w-50 px-2 pb-4">
                            <TextValidator
                                className="flex-row min-w-80"
                                isRequired
                                lable={"Tên khách hàng"}
                                name="tenKhachHang"
                                value={formik.values?.tenKhachHang || ""}
                                type="text"
                                errors={formik.errors?.tenKhachHang}
                                touched={formik.touched?.tenKhachHang}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {!isInfo && <div className="w-50 px-2 pb-4">
                            <Autocomplete
                                className="spaces z-index-10 width-100"
                                lable={"Tên đăng nhập: "}
                                options={optionUser}
                                isRequired
                                value={formik.values?.username || null}
                                name={"username"}
                                onChange={(selectedOption) => handleSelect("username", selectedOption.username)}
                                getOptionLabel={(option) => option?.username}
                                valueSearch="username"
                                styles={heightSelectMutil("auto", "38px", "100px")}
                                errors={formik.errors?.username}
                                touched={formik.touched?.username}
                            />
                        </div>
                        }
                        <div className="w-50 px-2">
                            <TextValidator
                                className="flex-row min-w-80"
                                lable={"Ngày sinh"}
                                isRequired
                                name="ngaySinh"
                                value={formik.values?.ngaySinh || ""}
                                type="date"
                                errors={formik.errors?.ngaySinh}
                                touched={formik.touched?.ngaySinh}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="w-50 px-2">
                            <Autocomplete
                                className="spaces z-index-8 width-100"
                                lable={"Giới tính"}
                                options={GENDER}
                                value={formik.values?.gioiTinh || null}
                                isRequired
                                name={"gioiTinh"}
                                onChange={(selectedOption) => handleSelect("gioiTinh", selectedOption)}
                                valueSearch={"code"}
                                styles={heightSelectMutil("auto", "38px", "100px")}
                                errors={formik.errors?.gioiTinh}
                                touched={formik.touched?.gioiTinh}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="flex-center">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>{lang("BTN.CANCEL")}</button>
                    <button type="submit" className="btn btn-primary">{lang("BTN.SAVE")}</button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
export { CustomerModal };
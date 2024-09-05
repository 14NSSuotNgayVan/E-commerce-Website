import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { initAddress } from "./consts/AddressConst";
import TextValidator from "../component/input-field/TextValidator";
import { REGEX, RESPONSE_STATUS_CODE } from "../utils/Constant";
import { addAddress, updateAddress } from "./services/AddressServices";
import Autocomplete from "../component/input-field/Autocomplete";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import { PROVINCE } from "../AddressDatabase";
import { checkObject, getDistrictByProvinceId, getWardByDistrictId } from "../utils/FunctionUtils";

function AddressModal(props: any) {
    const {
        isShowModal,
        handleCloseModal,
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        tenNguoiNhan: Yup.string()
            .matches(REGEX.TEN, lang("VALIDATION.NAME"))
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        soDienThoai: Yup.string()
            .matches(REGEX.CHECK_PHONE, lang("VALIDATION.ISPHONE"))
            .required(lang("VALIDATION.REQUIRE"))
            .nullable(),
        province: Yup.object().shape({}).required(lang("VALIDATION.REQUIRE")),
        district: Yup.object().shape({}).required(lang("VALIDATION.REQUIRE")),
        ward: Yup.object().shape({}).required(lang("VALIDATION.REQUIRE")),
        numberHouse: Yup.string(),
        diaChi: Yup.string().nullable(),
    });

    const handleSubmit: any = async () => {
        try {
            setPageLoading(true);
            const data = await (!formik.values?.id ? addAddress(formik.values) : updateAddress(formik.values));

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
        initialValues: initAddress,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const handleSelect = (name: string, value: any) => {
        switch (name) {
            case "province":
                formik.setValues({
                    ...formik.values,
                    [name]: value,
                    district: null,
                    ward: null
                });
                break;
            case "district":
                formik.setValues({
                    ...formik.values,
                    [name]: value,
                    ward: null
                });
                break;
            default:
                formik.setFieldValue(name, value);
                break;
        }
    }

    useEffect(() => {
        if(item && !checkObject(item)) {
            const address = item.diaChi?.split(", ");
            const province = address.pop();
            const district = address.pop();
            const ward = address.pop();
            const provinceItem = PROVINCE.find(p => p.name === province);
            const districtItem = provinceItem && 
                getDistrictByProvinceId(provinceItem?.code).find((d: any) => d.name === district);
            const wardItem = districtItem && 
                getWardByDistrictId(getDistrictByProvinceId(provinceItem?.code), districtItem?.code)
                .find((w: any) => w.name === ward);
            formik.setValues({ 
                ...formik.values, 
                ...item,
                province: provinceItem,
                district: districtItem,
                ward: wardItem,
                numberHouse: address.join(", ")
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const { province, district, ward, numberHouse } = formik.values;

    useEffect(() => {
        formik.setFieldValue("diaChi", `${numberHouse ? `${numberHouse}, ` :""}${ (ward?.name ? `${ward?.name}, ` : "")}${(district?.name ? `${district?.name}, ` : "")}${(province?.name ? `${province?.name}` : "")}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [province, district, ward, numberHouse]);

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
                                lable={"Tên nguời nhận"}
                                name="tenNguoiNhan"
                                value={formik.values?.tenNguoiNhan || ""}
                                type="text"
                                errors={formik.errors?.tenNguoiNhan}
                                touched={formik.touched?.tenNguoiNhan}
                                onChange={formik.handleChange}
                            />
                        </Col>
                        <Col sm={6}>
                            <TextValidator
                                className="flex-row min-w-80"
                                isRequired
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
                        <Col sm={4}>
                            <Autocomplete
                                className="spaces z-index-8 width-100"
                                lable={"Chọn Tỉnh/Thành phố"}
                                isRequired
                                options={PROVINCE}
                                value={formik.values?.province || null}
                                name={"province"}
                                onChange={(selectedOption) => handleSelect("province", selectedOption)}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.province}
                                touched={formik.touched?.province}
                            />
                        </Col>
                        <Col sm={4}>
                            <Autocomplete
                                className="spaces z-index-8 width-100"
                                lable={"Chọn Quận/Huyện"}
                                isRequired
                                options={formik.values?.province?.code ? getDistrictByProvinceId(formik.values?.province?.code) : []}
                                value={formik.values?.district}
                                name={"district"}
                                onChange={(selectedOption) => handleSelect("district", selectedOption)}
                                getOptionValue={(option) => option?.code}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.district}
                                touched={formik.touched?.district}
                            />
                        </Col>
                        <Col sm={4}>
                            <Autocomplete
                                className="spaces z-index-8 width-100"
                                lable={"Chọn Phường/Xã"}
                                isRequired
                                options={(formik.values?.province?.code && formik.values?.district?.code) ? 
                                    getWardByDistrictId(getDistrictByProvinceId(formik.values?.province?.code), formik.values?.district?.code) : []
                                }
                                value={formik.values?.ward}
                                name={"ward"}
                                onChange={(selectedOption) => handleSelect("ward", selectedOption)}
                                getOptionValue={(option) => option?.code}
                                styles={heightSelectMutil("auto", "36px", "100px")}
                                errors={formik.errors?.ward}
                                touched={formik.touched?.ward}
                            />
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col sm={12}>
                            <TextValidator
                                className="flex-row min-w-80"
                                as="textarea"
                                lable={"Địa chỉ nhà"}
                                name="numberHouse"
                                value={formik.values?.numberHouse}
                                type="text"
                                onChange={formik.handleChange}
                            />
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col sm={12}>
                            <TextValidator
                                className="flex-row min-w-80"
                                as="textarea"
                                value={formik.values?.diaChi}
                                type="text"
                                readOnly
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
export { AddressModal };
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { AddressModal } from "./AddressModal";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE, TYPE } from "../utils/Constant";
import InputSearch from "../component/input-field/InputSearch";
import { filterObject } from "../utils/FunctionUtils";
import { deleteAddress, searchAddress } from "./services/AddressServices";
import TableCustom from "../component/table-custom/TableCustom";
import { IAddress } from "./models/AddressModel";
import { KTSVG } from "~/_metronic/helpers";
import { Col, Row } from "react-bootstrap";

interface IProps {
    handleSetItem?: (item: IAddress) => void,
    isShowAddress?: boolean;
    checkedId?: string;
}

function Address(props: IProps) {
    const { handleSetItem, isShowAddress, checkedId } = props;
    const intl = useIntl();
    const { lang } = useMultiLanguage();
    const title = "GENERAL.ADDRESS";
    const { setPageLoading } = useContext(AppContext);
    const [item, setItem] = useState<any>({});
    const [dataAddress, setDataAddress] = useState<IAddress[]>([]);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
    });

    const handleShowModal = (item: any = {}) => {
        setIsShowModal(true);
        setItem({ ...item });
    };

    const handleCloseModal = () => {
        setIsShowModal(false);
        setItem({})
    };

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchAddress(filterObject(searchObject));

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataAddress(data?.data?.content);
                isShowAddress && handleSetItem && handleSetItem(data?.data?.content?.[0])
            }
        } catch (error) {
            console.log(error);
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    };

    const handleSearch = (data: any = {}) => {
        const searchData = {
            ...searchObject,
            ...data,
        };

        setSearchObject({
            ...searchData,
            pageSize: data?.pageSize,
            pageIndex: data?.pageIndex
        })

        updatePageData({ ...searchData });
    };

    const handleDeleteRows = async (ids: string) => {
        try {
            setPageLoading(true);
            const { data } = await deleteAddress(ids);
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Thành công");
                handleSearch();
            } else toast.error(data.message);
        } catch (error) {
            toast.error(lang(lang("GENERAL.ERROR")));
        } finally {
            setPageLoading(false);
        }
    }

    useEffect(() => {
        handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="spaces my-12">
            <div className="bg-white mt-2 p-2">
                <div className="header-container bg-white flex flex-space-between">
                    <span className="spaces fs-18 fw-bold text-uppercase">{intl.formatMessage({ id: title })}</span>
                    <button
                        className="btn btn-primary flex flex-middle gap-2"
                        onClick={(e: any) => {
                            e.preventDefault();
                            handleShowModal("");
                        }}
                    >
                        <KTSVG className="spaces fs-20 white flex flex-middle" path="/media/icons/plus.svg" />
                        <p className="spaces fs-14 m-0 ">Thêm mới</p>
                    </button>
                </div>
                <hr></hr>
                {dataAddress.map((item: IAddress) =>
                    <Row>
                        {isShowAddress &&
                            <Col sm={1}>
                                <input type="radio" checked={checkedId ? checkedId === item.id : false} name="address" onClick={() => { handleSetItem && handleSetItem(item) }} />
                            </Col>}
                        <Col sm={7}>
                            <p>{item.tenNguoiNhan} |<span className="text-muted"> {item.soDienThoai}</span></p>
                            <p>{item.diaChi}</p>
                        </Col>
                        <Col sm={isShowAddress ? 4 : 5} className="flex flex-end align-items-start">
                            <button type="button" className="btn btn-outline-primary me-2" onClick={() => handleShowModal(item)}>Cập nhật</button>
                            <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteRows(item.id)}>Xóa</button>
                        </Col>
                        <hr className="my-3"></hr>
                    </Row>
                )}
            </div>
            {isShowModal && <AddressModal isShowModal={isShowModal} handleCloseModal={handleCloseModal} handleSearch={handleSearch} item={item} />}
        </div>
    );
}

export default Address;

import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { PromotionModal } from "./PromotionModal";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE, TYPE } from "../utils/Constant";
import InputSearch from "../component/input-field/InputSearch";
import { checkStatus, filterObject, formatDateVN } from "../utils/FunctionUtils";
import { deletePromotion, searchPromotion } from "./services/PromotionServices";
import TableCustom from "../component/table-custom/TableCustom";
import { PROMOTION_STATUS_CODE, TRANG_THAI_KHUYEN_MAI } from "./consts/PromotionConst";

function Promotion() {
    const intl = useIntl();
    const { lang } = useMultiLanguage();
    const title = "GENERAL.PROMOTION";
    const { setPageLoading } = useContext(AppContext);
    const [item, setItem] = useState<any>({});
    const [dataDepartment, setDataDepartment] = useState<any[]>([]);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
    });

    const ColumnsDepartment = [
        {
            name: "STT",
            field: "",
            headerStyle: {
                minWidth: "40px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <span>{numericalOrder}</span>,
        },
        {
            name: "Trạng thái",
            field: "trangThai",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) =>
                <span className={`badge badge-${checkStatus(TRANG_THAI_KHUYEN_MAI,row.trangThai?.code)} rounded-pill d-inline spaces p-6`}>{row.trangThai?.name}</span>
            ,
        },
        {
            name: "Tên khuyến mãi",
            field: "tenKhuyenMai",
            headerStyle: {
                minWidth: "200px",
            },
        },
        {
            name: "Ngày bắt đầu",
            field: "ngayBatDau",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => formatDateVN(row.ngayBatDau),
        },
        {
            name: "Ngày kết thúc",
            field: "ngayKetThuc",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => formatDateVN(row.ngayKetThuc),
        }
    ];

    const handleShowModal = (item: any = {}) => {
        setIsShowModal(true);
        setItem({ ...item });
    };

    const handleCloseModal = () => {
        setItem({});
        setIsShowModal(false);
    };

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchPromotion(filterObject(searchObject));
            setTotalPage(data?.data?.totalPages);
            setTotalElements(data?.data?.totalElements);
            setNumberOfElements(data?.data?.numberOfElements);

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataDepartment(data?.data?.content);
            }
        } catch (error) {
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
            const { data } = await deletePromotion(ids);
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
    return (
        <div className="">
            <div className={`bg-white mt-2 p-2 spaces my-40 ${isShowModal && 'hidden'}`}>
                <div className="header-container bg-white flex flex-space-between">
                    <span className="spaces fs-18 fw-bold text-uppercase">{intl.formatMessage({ id: title })}</span>
                    <div className="flex flex-middle">
                        <InputSearch
                            className="flex-row spaces w-300 h-30"
                            value={searchObject.keyword || ""}
                            type="text"
                            placeholder="Tìm kiếm"
                            isEnter={true}
                            handleSearch={handleSearch}
                            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchObject({ ...searchObject, keyword: e.target?.value }); }}
                        />
                    </div>
                </div>
                <div className="table-custom">
                    <TableCustom
                        id="promotion"
                        data={dataDepartment || []}
                        page={searchObject?.pageIndex}
                        columns={ColumnsDepartment}
                        notDelete={false}
                        updatePageData={handleSearch}
                        totalPages={totalPage}
                        totalElements={totalElements}
                        numberOfElements={numberOfElements}
                        rowsPerPage={searchObject?.pageSize}
                        handleDoubleClick={handleShowModal}
                        handleDelete={handleDeleteRows}
                        isActionTableTab={false}
                        type={TYPE.MULTILINE}
                        noToolbar={false}
                        buttonAdd={true}
                        handleOpenDialog={(e: any) => {
                            e.preventDefault();
                            handleShowModal();
                        }}
                        deleteConditional={[
                            {
                                keyPath: "trangThai.code",
                                value: PROMOTION_STATUS_CODE.WAITING,
                            },
                        ]}

                    />
                </div>
            </div>
            {isShowModal && <PromotionModal handleCloseModal={handleCloseModal} handleSearch={handleSearch} item={item} setItem={setItem} />}
        </div>
    );
}

export default Promotion;

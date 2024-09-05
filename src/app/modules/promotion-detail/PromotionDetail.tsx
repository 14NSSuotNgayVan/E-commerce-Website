import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { PromotionDetailModal } from "./PromotionDetailModal";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE, TYPE } from "../utils/Constant";
import InputSearch from "../component/input-field/InputSearch";
import { convertNumberPrice, filterObject, formatDateVN } from "../utils/FunctionUtils";
import { deletePromotionDetail, searchPromotionDetail } from "./services/PromotionDetailServices";
import TableCustom from "../component/table-custom/TableCustom";

function PromotionDetail(props: any) {
    const { maKhuyenMai } = props;
    const intl = useIntl();
    const { lang } = useMultiLanguage();
    const title = "GENERAL.PROMOTION_DETAIL";
    const { setPageLoading } = useContext(AppContext);
    const [item, setItem] = useState<any>({});
    const [dataPromotionDetail, setDataPromotionDetail] = useState<any[]>([]);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
        maKhuyenMai: maKhuyenMai,
    });

    const ColumnsPromotionDetail = [
        {
            name: "STT",
            field: "",
            headerStyle: {
                minWidth: "40px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <span>{numericalOrder}</span>,
        },
        {
            name: "Sản phẩm",
            field: "product",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => row.product?.tenSanPham,
        },
        {
            name: "Giá khuyến mãi (VNĐ)",
            field: "giaKhuyenMai",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any) => <span>{convertNumberPrice(row.giaKhuyenMai)}</span>
        },
    ];

    const handleShowModal = (item: any = {}) => {
        setIsShowModal(true);
        setItem({
            ...item,
            maKhuyenMai: maKhuyenMai,
        });
    };

    const handleCloseModal = () => {
        setIsShowModal(false);
        setItem({})
    };

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchPromotionDetail(filterObject(searchObject));
            setTotalPage(data?.data?.totalPages);
            setTotalElements(data?.data?.totalElements);
            setNumberOfElements(data?.data?.numberOfElements);

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataPromotionDetail(data?.data?.content);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    };

    const handleSearch = (data: any = {}) => {
        if(!maKhuyenMai) return;
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
            const { data } = await deletePromotionDetail(ids);
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Thành công");
                handleSearch();
            }else toast.error(data.message);
        } catch (error) {
            toast.error(lang(lang("GENERAL.ERROR")));
        } finally {
            setPageLoading(false);
        }
    }

    return (
        <div className="">
            <div className="bg-white mt-2 p-2">
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
                        id="promotion-detail"
                        data={dataPromotionDetail || []}
                        page={searchObject?.pageIndex}
                        columns={ColumnsPromotionDetail}
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

                    />
                </div>
            </div>
            <PromotionDetailModal isShowModal={isShowModal} handleCloseModal={handleCloseModal} handleSearch ={handleSearch} item={item} />
        </div>
    );
}

export default PromotionDetail;

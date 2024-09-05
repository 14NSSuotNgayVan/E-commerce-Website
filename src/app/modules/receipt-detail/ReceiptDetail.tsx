import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { ReceiptDetailModal } from "./ReceiptDetailModal";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE, TYPE } from "../utils/Constant";
import InputSearch from "../component/input-field/InputSearch";
import { convertNumberPrice, filterObject, formatDateVN } from "../utils/FunctionUtils";
import { deleteReceiptDetail, searchReceiptDetail } from "./services/ReceiptDetailServices";
import TableCustom from "../component/table-custom/TableCustom";
import { priceUnitDefault } from "../constant";

function ReceiptDetail(props: any) {
    const { maPhieuNhapKho, xacNhanNhapKho, setIsEnableToApproval } = props;
    const intl = useIntl();
    const { lang } = useMultiLanguage();
    const title = "GENERAL.RECEIPT_DETAIL";
    const { setPageLoading } = useContext(AppContext);
    const [item, setItem] = useState<any>({});
    const [dataReceiptDetail, setDataReceiptDetail] = useState<any[]>([]);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
        maPhieuNhapKho: maPhieuNhapKho,
    });

    const ColumnsReceiptDetail = [
        {
            name: "STT",
            field: "",
            headerStyle: {
                minWidth: "40px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <span>{numericalOrder}</span>,
        },
        {
            name: "Tên sản phẩm",
            field: "productDetail",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => row.productDetail?.product?.tenSanPham,
        },
        {
            name: "Màu",
            field: "productDetail",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => row.productDetail?.color?.tenMau,
        },
        {
            name: "Kích thước",
            field: "productDetail",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => row.productDetail?.size?.tenKichThuoc,
        },
        {
            name: "Số lượng nhập",
            field: "soLuongNhap",
            headerStyle: {
                minWidth: "100px",
            },
        },
        {
            name: "Giá nhập (VNĐ)",
            field: "giaNhap",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any) => <span>{convertNumberPrice(row.giaNhap)}</span>
        },
    ];

    const handleShowModal = (item: any = {}) => {
        setIsShowModal(true);
        setItem({
            ...item,
            maPhieuNhapKho: maPhieuNhapKho,
        });
    };

    const handleCloseModal = () => {
        setIsShowModal(false);
        setItem({})
    };

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchReceiptDetail(filterObject(searchObject));
            setTotalPage(data?.data?.totalPages);
            setTotalElements(data?.data?.totalElements);
            setNumberOfElements(data?.data?.numberOfElements);
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataReceiptDetail(data?.data?.content);
                setIsEnableToApproval(data?.data?.content.length > 0)
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    };

    const handleSearch = (data: any = {}) => {
        if (!maPhieuNhapKho) return;
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
            const { data } = await deleteReceiptDetail(ids);
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
                        id="ceceipt-detail"
                        data={dataReceiptDetail || []}
                        page={searchObject?.pageIndex}
                        columns={ColumnsReceiptDetail}
                        notDelete={xacNhanNhapKho}
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
                        buttonAdd={!xacNhanNhapKho}
                        handleOpenDialog={(e: any) => {
                            e.preventDefault();
                            handleShowModal();
                        }}
                        notEdit={xacNhanNhapKho}
                    />
                </div>
            </div>
            <ReceiptDetailModal isShowModal={isShowModal} handleCloseModal={handleCloseModal} handleSearch={handleSearch} item={item} xacNhanNhapKho={xacNhanNhapKho} />
        </div>
    );
}

export default ReceiptDetail;

import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE, TYPE } from "../utils/Constant";
import InputSearch from "../component/input-field/InputSearch";
import {  filterObject } from "../utils/FunctionUtils";
import TableCustom, { columnNamesType } from "../component/table-custom/TableCustom";
import {  searchOrder, updateOrder } from "../oder-info/services/OderInfoServices";
import { oderStatus, paymentStatus } from "../oder-info/constants/oderInfoConstants";
import ConfirmDialog from "../component/ConfirmDialog";

interface IProps {
    trangThaiDonHang: number,
    column: (orderStatus: number, handleShowModal: (item: any) => void) => columnNamesType[]
}

function OrderManager(props: IProps) {
    const { column, trangThaiDonHang } = props;
    const intl = useIntl();
    const { lang } = useMultiLanguage();
    const title = "GENERAL.CUSTOMER";
    const { setPageLoading } = useContext(AppContext);
    const [item, setItem] = useState<any>({});
    const [dataOrder, setDataOrder] = useState<any[]>([]);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
    });

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchOrder(filterObject({...searchObject,trangThaiDonHang: trangThaiDonHang}));
            setTotalPage(data?.data?.totalPages);
            setTotalElements(data?.data?.totalElements);
            setNumberOfElements(data?.data?.numberOfElements);

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataOrder(data?.data?.content);
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

    const handleShowModal = (item: any = {}) => {
        setIsShowModal(true);
        setItem({ ...item });
    };

    const handleCloseModal = () => {
        setIsShowModal(false);
        setItem({})
    };

    const UpdateOderStatus = async () => {
        try {
            setPageLoading(true);
            const { data } = await updateOrder({
                ...item,
                trangThaiDonHang: trangThaiDonHang === oderStatus.choThanhToan ? oderStatus.choXuLy 
                    : (trangThaiDonHang === oderStatus.choXuLy) ? oderStatus.chuanBiHang 
                    : (trangThaiDonHang === oderStatus.chuanBiHang) ? oderStatus.DangDuocGiao : item.trangThaiDonHang,
                trangThaiThanhToan: trangThaiDonHang === oderStatus.choThanhToan ? paymentStatus.daThanhToan : item.trangThaiThanhToan.code
            });

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                updatePageData();
                handleCloseModal()
            } else toast.error(data.message);

        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }
    return (
        <div className="">
            <div className="bg-white mt-2 p-2">
                <div className="header-container bg-white flex flex-end">
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
                        id="order"
                        data={dataOrder || []}
                        page={searchObject?.pageIndex}
                        columns={column(trangThaiDonHang, handleShowModal)}
                        notDelete={false}
                        updatePageData={handleSearch}
                        totalPages={totalPage}
                        totalElements={totalElements}
                        numberOfElements={numberOfElements}
                        rowsPerPage={searchObject?.pageSize}
                        isActionTableTab={false}
                        noToolbar={true}
                    />
                </div>
            </div>
            <ConfirmDialog view={isShowModal} onYesClick={() => UpdateOderStatus()} onCancelClick={() => handleCloseModal()} Description={
                trangThaiDonHang === oderStatus.choThanhToan ? "Xác nhận đã thanh toán?"
                : trangThaiDonHang === oderStatus.choXuLy ? "Xác nhận chuẩn bị hàng?"
                : "Xác nhận giao hàng?"
            } />
        </div>
    );
}

export default OrderManager;

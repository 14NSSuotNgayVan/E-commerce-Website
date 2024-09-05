import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { CustomerModal } from "./CustomerModal";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE, TYPE } from "../utils/Constant";
import InputSearch from "../component/input-field/InputSearch";
import { filterObject, formatDateVN } from "../utils/FunctionUtils";
import { deleteCustomer, searchCustomer } from "./services/CustomerServices";
import TableCustom from "../component/table-custom/TableCustom";
import { GENDER } from "../constant";

function Customer() {
    const intl = useIntl();
    const { lang } = useMultiLanguage();
    const title = "GENERAL.CUSTOMER";
    const { setPageLoading } = useContext(AppContext);
    const [item, setItem] = useState<any>({});
    const [dataCustomer, setDataCustomer] = useState<any[]>([]);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
    });

    const ColumnsCustomer = [
        {
            name: "STT",
            field: "",
            headerStyle: {
                minWidth: "40px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <span>{numericalOrder}</span>,
        },
        {
            name: "Tên khách hàng",
            field: "tenKhachHang",
            headerStyle: {
                minWidth: "100px",
            },
        },
        {
            name: "Tên người dùng",
            field: "username",
            headerStyle: {
                minWidth: "100px",
            },
        },
        {
            name: "Ngày sinh",
            field: "ngaySinh",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => formatDateVN(row.ngaySinh),
        },
        {
            name: "Giới tính",
            field: "gioiTinh",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => GENDER.find(item => item.code === row.gioiTinh?.code)?.name,
        },
    ];

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
            const { data } = await searchCustomer(filterObject(searchObject));
            setTotalPage(data?.data?.totalPages);
            setTotalElements(data?.data?.totalElements);
            setNumberOfElements(data?.data?.numberOfElements);

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataCustomer(data?.data?.content);
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
            const { data } = await deleteCustomer(ids);
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
        <div className="spaces my-40">
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
                        id="customer"
                        data={dataCustomer || []}
                        page={searchObject?.pageIndex}
                        columns={ColumnsCustomer}
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
                            handleShowModal("");
                        }}

                    />
                </div>
            </div>
            {isShowModal && <CustomerModal isShowModal={isShowModal} handleCloseModal={handleCloseModal} handleSearch={handleSearch} item={item} />}
        </div>
    );
}

export default Customer;

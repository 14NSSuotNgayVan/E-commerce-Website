import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { ProductModal } from "./ProductModal";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE, TYPE } from "../utils/Constant";
import InputSearch from "../component/input-field/InputSearch";
import { convertNumberPrice, filterObject, formatDateVN } from "../utils/FunctionUtils";
import { deleteProduct, searchProduct } from "./services/ProductServices";
import TableCustom from "../component/table-custom/TableCustom";

function Product() {
    const intl = useIntl();
    const { lang } = useMultiLanguage();
    const title = "GENERAL.PRODUCT";
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
        includeProductDetail: 0
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
            name: "Tên sản phẩm",
            field: "tenSanPham",
            headerStyle: {
                minWidth: "220px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <span className="line-clamp-3">{row?.tenSanPham}</span>,

        },
        {
            name: "Phân loại sản phẩm",
            field: "category",
            headerStyle: {
                minWidth: "150px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => row.category.tenLoai,
        },
        {
            name: "Số sao TB",
            field: "soSaoTB",
            headerStyle: {
                minWidth: "90px",
            },
        },
        {
            name: "Số lượt đánh giá",
            field: "soLuotDanhGia",
            headerStyle: {
                minWidth: "130px",
            },
        },
        {
            name: "Đã bán",
            field: "tongSoBan",
            headerStyle: {
                minWidth: "90px",
            }
        },
        {
            name: "Giá tiền (VNĐ)",
            field: "giaTien",
            headerStyle: {
                minWidth: "120px",
            },
            render: (row: any) => <span>{convertNumberPrice(row?.giaTien)}</span>
        },
        {
            name: "Mô tả",
            field: "moTa",
            headerStyle: {
                minWidth: "400px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <span className="line-clamp-3">{row?.moTa}</span>,
        },
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
            const { data } = await searchProduct(searchObject);
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
            const { data } = await deleteProduct(ids);
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
                        id="product"
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

                    />
                </div>
            </div>
            {isShowModal && <ProductModal handleCloseModal={handleCloseModal} handleSearch={handleSearch} item={item} setItem={setItem} />}
        </div>
    );
}

export default Product;

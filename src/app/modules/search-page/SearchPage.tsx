import { FC, useContext, useEffect, useState } from "react";
import ProductContainer from "../product-container/ProductContainer";
import CollapseMenu from "./components/CollapseMenu";
import PaginationCustom from "../component/pagination-custom/Pagination";
import { useParams } from "react-router-dom";
import AppContext from "~/app/AppContext";
import { searchProduct } from "../product/services/ProductServices";
import { filterObject } from "../utils/FunctionUtils";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { toast } from "react-toastify";
import { searchCategory } from "../category/services/CategoryServices";
import { ICategory } from "../category/models/CategoryModel";
import { searchSize } from "../size/services/SizeServices";
import { ISize } from "../size/models/SizeModel";
import { searchColor } from "../color/services/ColorServices";
import { IColor } from "../color/models/ColorModel";
import useMultiLanguage from "~/app/hook/useMultiLanguage";

interface Iprops {
    className?: string;
}

const SearchPage: FC<Iprops> = (props) => {
    const {
        className
    } = props;
    const { lang } = useMultiLanguage();
    const { query, category } = useParams();
    const { setPageLoading } = useContext(AppContext);
    const [data, setData] = useState<any[]>([]);
    const [dataCategory, setDataCategory] = useState<any[]>([]);
    const [dataSize, setDataSize] = useState<any[]>([]);
    const [dataColor, setDataColor] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [checkedCategory, setCheckedCategory] = useState<any[]>([]);
    const [checkedSize, setCheckedSize] = useState<any[]>([]);
    const [checkedColor, setCheckedColor] = useState<any[]>([]);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: query,
        giaTu: 0,
        giaDen: 0,
        maMau: "",
        maKichThuoc: "",
        maLoaiSanPham: "",
        searchType: 0,
    });

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchProduct(filterObject(searchObject));
            setTotalPage(data?.data?.totalPages);
            setTotalElements(data?.data?.totalElements);
            setNumberOfElements(data?.data?.numberOfElements);

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setData(searchObject.searchType == 1 ? data?.data?.content.sort((a: any, b: any) => Number(b.soSaoTB) - Number(a.soSaoTB)) : data?.data?.content);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checkedItems: any[], setCheckedItems: (item: any[]) => void) => {
        const value = e.target.value;
        if (checkedItems.includes(value)) {
            setCheckedItems(checkedItems.filter((item) => item !== value));
        } else {
            setCheckedItems([...checkedItems, value]);
        }
    };

    const getCategory = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchCategory(filterObject(searchObject));

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataCategory(data?.data?.content);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    };

    const getColor = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchColor(filterObject(searchObject));

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataColor(data?.data?.content);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    };

    const getSize = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchSize(filterObject(searchObject));

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataSize(data?.data?.content);
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
            maLoaiSanPham: checkedCategory.join(","),
            maMau: checkedColor.join(","),
            maKichThuoc: checkedSize.join(","),
            ...data,
        };

        setSearchObject({
            ...searchData,
            pageSize: data?.pageSize,
            pageIndex: data?.pageIndex
        })

        updatePageData({ ...searchData });
    };

    useEffect(() => {
        getCategory();
        getSize();
        getColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        category && setCheckedCategory(category.split(","))
        handleSearch(category ? { maLoaiSanPham: category } : { keyword: query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, category])


    return (

        <section className={`spaces my-40 ${className || ""}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <button
                            className="btn btn-outline-secondary mb-3 w-100 d-lg-none"
                            type="button"
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <span>{!showFilter ? 'Hiện bộ lọc' : 'Ẩn bộ lọc'}</span>
                        </button>
                        <div className={`collapse card mb-5 ${showFilter ? "d-block" : "d-lg-block"}`} id="navbarSupportedContent">
                            <div className="accordion" id="accordionPanelsStayOpenExample">
                                <CollapseMenu defaultActive={true} eventKey="#panelsStayOpen-collapseTwo" title="Loại sản phẩm">
                                    <div>
                                        {dataCategory.map((item: ICategory) =>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" value={item.id} id="flexCheckChecked1" checked={checkedCategory.includes(String(item.id))} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCheckboxChange(e, checkedCategory, setCheckedCategory)} />
                                                <label className="form-check-label" htmlFor="flexCheckChecked1">{item.tenLoai}</label>
                                            </div>)}
                                    </div>
                                </CollapseMenu>
                                <CollapseMenu defaultActive={true} eventKey="#panelsStayOpen-collapseFour" title="Kích cỡ">
                                    <div className="flex flex-wrap">
                                        {dataSize.map((item: ISize) =>
                                            <div className="me-1">
                                                <input type="checkbox" className="btn-check border justify-content-center" value={item.id} id={`btn-check-size-${item.id}`} autoComplete="off" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCheckboxChange(e, checkedSize, setCheckedSize)} />
                                                <label className="btn btn-white mb-1 px-2 py-1 " htmlFor={`btn-check-size-${item.id}`}>{item.tenKichThuoc}</label>
                                            </div>
                                        )}
                                    </div>
                                </CollapseMenu>
                                <CollapseMenu defaultActive={true} eventKey="#panelsStayOpen-collapseFour" title="Màu">
                                    <div className="flex flex-wrap">
                                        {dataColor.map((item: IColor) =>
                                            <div className="me-1">
                                                <input type="checkbox" className="btn-check border justify-content-center" value={item.id} id={`btn-check-color-${item.id}`} autoComplete="off" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCheckboxChange(e, checkedColor, setCheckedColor)} />
                                                <label className="btn btn-white mb-1 px-2 py-1 " htmlFor={`btn-check-color-${item.id}`}>{item.tenMau}</label>
                                            </div>
                                        )}
                                    </div>
                                </CollapseMenu>
                                <CollapseMenu defaultActive={true} eventKey="#panelsStayOpen-collapseThree" title="Khoảng giá">
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <div className="form-outline">
                                                <input type="number" id="typeNumber" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => searchObject({ ...searchObject, giaTu: e.target.value })} />
                                                <label className="form-label bg-white" htmlFor="typeNumber">Từ</label>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-outline">
                                                <input type="number" id="typeNumber" className="form-control" placeholder="" onChange={(e: React.ChangeEvent<HTMLInputElement>) => searchObject({ ...searchObject, giaDen: e.target.value })} />
                                                <label className="form-label bg-white" htmlFor="typeNumber">Đến</label>
                                            </div>
                                        </div>
                                    </div>
                                </CollapseMenu>
                                <div className="accordion-item">
                                    <div className="accordion-body">
                                        <button type="button" className="btn btn-white w-100 border border-secondary" onClick={() => handleSearch()}>Áp dụng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <header className="d-sm-flex align-items-center border-bottom mb-4 pb-3">
                            <strong className="d-block py-2">Kết quả : {data.length} </strong>
                            <div className="ms-auto">
                                <select className="form-select d-inline-block w-auto border pt-1" value={searchObject.searchType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSearch({ searchType: Number(e.target.value) })}>
                                    <option value="0">Phù hợp nhất</option>
                                    <option value="1">Đánh giá cao nhất</option>
                                </select>
                            </div>
                        </header>
                        <ProductContainer
                            data={data}
                            rowSize={3}
                        />
                        <hr />
                        <PaginationCustom pageSize={searchObject.pageSize} totalPage={totalPage} pageIndex={searchObject.pageIndex} changePage={(value: number) => handleSearch({ ...searchObject, pageIndex: value })} changePerPage={(value: number) => handleSearch({ ...searchObject, pageSize: value })} changeRowPerPage={true} totalElements={totalElements} numberOfElements={numberOfElements} />
                    </div>
                </div >
            </div >
        </section >

    )
}

export { SearchPage };
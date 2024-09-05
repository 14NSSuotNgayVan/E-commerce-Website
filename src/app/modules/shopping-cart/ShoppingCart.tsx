import { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../product/models/ProductModel";
import AppContext from "~/app/AppContext";
import { searchProduct } from "../product/services/ProductServices";
import { convertNumberPriceWithUnit, filterObject } from "../utils/FunctionUtils";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { toast } from "react-toastify";
import { searchCart } from "./services/ShoppingCartServices";
import { ICartItem } from "./models/ShoppingCartModels";
import ShoppingCartItem from "./ShopppingCartItem";
import { OderInfo } from "../oder-info/OderInfo";
import { ProductCard } from "../product-card/ProductCard";
import { Row } from "react-bootstrap";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
interface IProps {
    className?: string;
}

const ShoppingCart: FC<IProps> = (props) => {
    const {
        className
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);
    const [dataSimilar, setDataSimilar] = useState<IProduct[]>([]);
    const [data, setData] = useState<ICartItem[]>([]);
    const [total, setTotal] = useState<number>(0)
    const [sumQuantity, setSumQuantity] = useState<number>(0)
    const [isOrdering, setIsOrdering] = useState<boolean>(false);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
    });

    const getSimilarCategory = () => {
        return [...new Set(data.map((item: ICartItem) => item.productDetail.product?.maLoaiSanPham))].join(', ')
    }

    const getDataSimilar = async () => {
        try {
            setPageLoading(true);
            const { data } = await searchProduct(filterObject({
                pageSize: 10,
                pageIndex: 1,
                maLoaiSanPham: getSimilarCategory()
            }));
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataSimilar(data?.data.content);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchCart(filterObject(searchObject));
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setData(data?.data?.content);
                setSumQuantity(data?.data?.content?.reduce((total: any, item: ICartItem) => Number(total) + Number(item.soLuong), 0));
                setTotal(data?.data?.content?.reduce((total: any, item: ICartItem) => Number(total) + (Number(item.giaBan) * Number(item.soLuong)), 0))
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

    useEffect(() => {
        getDataSimilar();
        handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
console.log(data);
    return (
        <div className={`spaces my-40 ${className || ""}`}>
            {!isOrdering ?
                <div>
                    <section className="bg-light my-5 p-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-9">
                                    <div className="card border shadow-0">
                                        <div className="m-4">
                                            <h4 className="card-title mb-4">Giỏ hàng của bạn</h4>
                                            {data.length > 0 ? data.map((item: ICartItem) => {
                                                console.log(item);
                                                return <ShoppingCartItem item={item} handleSearch={handleSearch} />
                                            }
                                            ) :
                                                (<p className="text-muted text-center">
                                                    Không có sản phẩm nào trong giỏ hàng của bạn
                                                </p>)}
                                        </div>

                                        <div className="border-top pt-4 mx-4 mb-4">
                                            <p><i className="fas fa-truck text-muted fa-lg"></i> Giao hàng miễn phí chỉ trong 1-2 tuần</p>
                                            <p className="text-muted">
                                                Chúng tôi cam kết mang đến sự hài lòng cho khách hàng trong mọi khía cạnh, từ chất lượng sản phẩm đến dịch vụ giao hàng. Nếu bạn có bất kỳ câu hỏi nào về quy trình giao hàng của chúng tôi hoặc cần trợ giúp về đơn hàng của mình, xin đừng ngần ngại liên hệ với chúng tôi.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="card shadow-0 border">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <p className="mb-2">Tổng số lượng:</p>
                                                <p className="mb-2">{sumQuantity}</p>
                                            </div>
                                            <hr />
                                            <div className="d-flex justify-content-between">
                                                <p className="mb-2">Tổng thành tiền:</p>
                                                <p className="mb-2 fw-bold">{convertNumberPriceWithUnit(total)}</p>
                                            </div>

                                            <div className="mt-3">
                                                <button className="btn btn-success w-100 shadow-0 mb-2" onClick={() => setIsOrdering(true)} disabled={data.length === 0}>Đặt hàng</button>
                                                <Link to='/home' className="btn btn-light w-100 border mt-2">Tiếp tục mua sắm</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="container my-5">
                            <header className="mb-4">
                                <h3>Sản phẩm gợi ý</h3>
                            </header>
                            <Row className="overflow-scroll flex-wrap-none" sm={2} md={3} lg={4}> 
                                {
                                    dataSimilar.map((item: IProduct, index: number) =>
                                        <ProductCard data={item} className="spaces min-w-150"/>
                                    )
                                }
                            </Row>
                        </div>
                    </section >
                </div> 
                : <OderInfo handleback={() => setIsOrdering(false)} dataProduct={data} total={total} isFromCart={true} />
            }
        </div>
    )
}

export { ShoppingCart };
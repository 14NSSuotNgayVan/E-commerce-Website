import { FC, useContext, useEffect, useState } from "react";
import './styles/product-style.scss';
import { Rating } from "@mui/material";
import ScaleImage from "../component/ImageComponent/ScaleImage";
import { Link, useParams } from "react-router-dom";
import { getProductById, searchProduct } from "../product/services/ProductServices";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import AppContext from "~/app/AppContext";
import { toast } from "react-toastify";
import { IProduct } from "../product/models/ProductModel";
import { initProduct } from "../product/consts/ProductConst";
import { IProductDetail } from "../product-detail/models/ProductDetailModel";
import { IColor } from "../color/models/ColorModel";
import { searchColorDetail, searchSizeDetail } from "../receipt-detail/services/ReceiptDetailServices";
import { ISize } from "../size/models/SizeModel";
import Autocomplete from "../component/input-field/Autocomplete";
import { heightSelectMutil } from "../component/input-field/StyleComponent";
import { convertNumberPriceWithUnit, filterObject, handleAddToCart, handleToggleFavourite } from "../utils/FunctionUtils";
import { useAuth } from "../auth";
import { Col } from "react-bootstrap";
import { searchProductDetail } from "../product-detail/services/ProductDetailServices";
import { initProductDetail } from "../product-detail/consts/ProductDetailConst";
import { ICartItem } from "../shopping-cart/models/ShoppingCartModels";
import { initCartItem } from "../shopping-cart/constants/ShoppingCartConst";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import { productUnit } from "../constant";
import { OderInfo } from "../oder-info/OderInfo";
import { Comment } from "../component/comment/Comment";

interface IProps {
    className?: string;
}

const ProductDetails: FC<IProps> = (props) => {
    const {
        className
    } = props;
    const { id } = useParams();
    const { lang } = useMultiLanguage();
    const { currentUser } = useAuth()
    const { setPageLoading } = useContext(AppContext);
    const [dataProduct, setDataProduct] = useState<IProduct>(initProduct);
    const [dataSimilarFull, setDataSimilarFull] = useState<IProduct[]>([]);
    const [dataSimilar, setDataSimilar] = useState<IProduct[]>([]);
    const [dataColor, setDataColor] = useState<IColor[]>([]);
    const [dataSize, setDataSize] = useState<ISize[]>([]);
    const [dataImage, setDataImage] = useState<string>("");
    const [isOdering, setIsOdering] = useState<boolean>(false);
    const [fakeDataCartItem, setFakeDataCartItem] = useState<ICartItem>(initCartItem)
    const [formData, setFormData] = useState<{ chiTietSanPham: IProductDetail | null, soLuong: number }>({
        chiTietSanPham: null,
        soLuong: 1
    });

    const getDataSimilar = async (categoryId: string) => {
        try {
            setPageLoading(true);
            const { data } = await searchProduct(filterObject({
                pageSize: 10,
                pageIndex: 1,
                maLoaiSanPham: categoryId
            }));
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataSimilarFull(data.data?.content);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const getDataDetail = async () => {
        try {
            setPageLoading(true);
            const { data } = await getProductById({ id })
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataProduct(data?.data);
                setDataImage(data?.data?.hinhAnh);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const getDataColorDetail = async () => {
        try {
            setPageLoading(true);
            const { data } = await searchColorDetail({ productId: id })
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataColor(data?.data);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const getDataSizeDetail = async () => {
        try {
            setPageLoading(true);
            const { data } = await searchSizeDetail({ productId: id })
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataSize(data?.data);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const parseDataCartItem = (): ICartItem => {
        return {
            id: "",
            maChiTietSanPham: formData.chiTietSanPham?.id || "",
            soLuong: formData.soLuong,
            giaBan: (dataProduct.giaKhuyenMai ? dataProduct.giaKhuyenMai : dataProduct.giaTien) || 0,
            productDetail: { ...(formData.chiTietSanPham || initProductDetail), product: dataProduct },
        }
    }

    const handleAddItemToCart = () => {
        handleAddToCart({
            maChiTietSanPham: formData?.chiTietSanPham?.id,
            soLuong: formData.soLuong,
            giaBan: dataProduct?.giaKhuyenMai ?
                dataProduct?.giaKhuyenMai :
                dataProduct?.giaTien
        })
    }

    useEffect(() => {
        getDataDetail();
        getDataColorDetail();
        getDataSizeDetail();
        setFormData({
            chiTietSanPham: null,
            soLuong: 1
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    
    useEffect(() => {
        if(dataSimilarFull.length > 0) {
            const dataFilter = dataSimilarFull.filter((product: IProduct) => product.id !== id);
            setDataSimilar(dataFilter);
        }    
    }, [id, dataSimilarFull]);

    useEffect(() => {
        if (dataProduct.category?.id) getDataSimilar(dataProduct.category?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataProduct.category?.id])

    const handleShowOrderDetail = () => {
        setFakeDataCartItem(parseDataCartItem());
        setIsOdering(true);
    }

    return (
        <div className={`spaces my-40 ${className || ""}`}>
            {!isOdering ?
                <div>
                    {/* content */}
                    <section className="py-5">
                        <div className="container">
                            <div className="row gx-5">
                                <aside className="col-lg-6">
                                    <div className="mb-3 px-16 d-flex justify-content-center">
                                        <ScaleImage className="border rounded-4 spaces w-400 h-300" src={`${dataImage || dataProduct.hinhAnh}`} scale={1.5} />
                                    </div>
                                    <div className="d-flex justify-content-center mb-3">
                                        <button data-fslightbox="mygalley" className="border mx-1 rounded-2 cursor-pointer active-border" type="button" data-type="image" onClick={() => setDataImage(dataProduct.hinhAnh)}>
                                            <img width="60" height="60" className="rounded-2" src={`${dataProduct.hinhAnh}`} />
                                        </button>
                                        {dataProduct.listProductDetail?.map((item: IProductDetail) =>
                                            item.hinhAnh && 
                                            <button data-fslightbox="mygalley" className="border mx-1 rounded-2 cursor-pointer active-border" type="button" data-type="image" onClick={() => setDataImage(item.hinhAnh)}>
                                                <img width="60" height="60" className="rounded-2" src={`${item.hinhAnh}`} />
                                            </button>
                                        )}
                                    </div>
                                </aside>
                                <main className="col-lg-6">
                                    <div className="ps-lg-3">
                                        <h4 className="title text-dark">
                                            {dataProduct.tenSanPham}<br />
                                        </h4>
                                        <div className="d-flex flex-row my-3 ">
                                            <div className="text-warning mb-1 me-2 flex align-items-center">
                                                <Rating name="half-rating" value={Number(dataProduct.soSaoTB)} precision={0.5} readOnly />
                                                <span className="ms-1">
                                                    {dataProduct.soSaoTB}
                                                </span>
                                            </div>
                                            <span className="text-success"><i className="fas fa-shopping-basket fa-sm mx-1 text-success"></i>{dataProduct.tongSoBan}</span>
                                            <span className="text-success ms-2">Đã bán</span>
                                        </div>

                                        <div className="mb-3">
                                            {dataProduct.giaKhuyenMai && <h4 className="text-danger text-line-through">{convertNumberPriceWithUnit(dataProduct.giaTien)}</h4>}
                                            <span className="h3">{convertNumberPriceWithUnit(dataProduct.giaKhuyenMai ? dataProduct.giaKhuyenMai : dataProduct.giaTien)}</span>
                                            <span className="text-muted">/{productUnit}</span>
                                        </div>

                                        <div className="row">
                                            <dt className="col-3">Loại:</dt>
                                            <dd className="col-9">{dataProduct.category?.tenLoai}</dd>

                                            <dt className="col-3">Màu: </dt>
                                            <dd className="col-9">{dataColor.map((item: IColor) => item.tenMau).join(", ")}</dd>

                                            <dt className="col-3">Kích thước</dt>
                                            <dd className="col-9">{dataSize.map((item: ISize) => item.tenKichThuoc).join(", ")}</dd>
                                        </div>

                                        <hr />

                                        <div className="row mb-4">
                                            <Col sm={6}>
                                                <Autocomplete
                                                    className="spaces z-index-8 width-100"
                                                    lable={"Loại"}
                                                    options={[]}
                                                    searchFunction={searchProductDetail}
                                                    searchObject={{ pageSize: 999, pageIndex: 1, maSanPham: dataProduct.id }}
                                                    value={formData.chiTietSanPham}
                                                    name={"size"}
                                                    onChange={(selectedOption) => setFormData({ ...formData, chiTietSanPham: selectedOption })}
                                                    valueSearch={"id"}
                                                    getOptionLabel={(option: IProductDetail) => option?.size?.tenKichThuoc && option?.color?.tenMau ? `Màu ${option?.color?.tenMau} - Size ${option?.size?.tenKichThuoc}` : ''}
                                                    getOptionValue={(option: any) => option}
                                                    styles={heightSelectMutil("auto", "36px", "100px")}
                                                    dependencies={[]}
                                                />
                                                {formData?.chiTietSanPham?.id && !formData?.chiTietSanPham?.soLuong && <span className="text-muted">Sản phẩm này đã hết</span>}
                                            </Col>
                                            {/* col.// */}
                                            <div className="col-md-4 col-6">
                                                <label className="d-block">Số lượng</label>
                                                <div className="input-group mb-3 spaces w-180 flex align-items-center">
                                                    <button onClick={() => setFormData({ ...formData, soLuong: Number(formData.soLuong) > 1 ? Number(formData.soLuong) - 1 : 1 })} className="btn btn-primary border border-secondary spaces h-36" type="button" id="button-addon1" data-mdb-ripple-color="dark">
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                    <input type="number" min={1} className="form-control text-center border border-secondary spaces h-36 number-no-spin" placeholder="Số lượng" value={formData.soLuong}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, soLuong: Number(e.target.value) })} aria-label="Example text with button addon" aria-describedby="button-addon1" />
                                                    <button onClick={() => setFormData({ ...formData, soLuong: Number(formData.soLuong) + 1 })} className="btn btn-primary border border-secondary spaces h-36" type="button" id="button-addon2" data-mdb-ripple-color="dark">
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                                {formData?.chiTietSanPham?.id && formData?.chiTietSanPham?.soLuong && <span className="text-muted">Còn lại: {formData?.chiTietSanPham?.soLuong}</span>}
                                            </div>
                                        </div>
                                        {!currentUser && <Link to={'/auth'} className="btn btn-warning shadow-0 spaces mr-4">Mua</Link>}
                                        {!currentUser && <Link to={'/auth'} className="btn btn-primary shadow-0 spaces mr-4"> <i className="me-1 fa fa-shopping-basket"></i>Thêm vào giỏ hàng</Link>}
                                        {!currentUser && <Link to={'/auth'} className="btn btn-light border border-secondary py-2 icon-hover px-3"> <i className="me-1 fa fa-heart fa-lg"></i></Link>}

                                        {currentUser && <button className="btn btn-warning shadow-0 spaces mr-4" onClick={handleShowOrderDetail} disabled={!formData?.chiTietSanPham?.id || !formData.soLuong || !formData.chiTietSanPham.soLuong}>Mua</button>}
                                        {currentUser && <button className="btn btn-primary shadow-0 spaces mr-4" onClick={handleAddItemToCart} disabled={!formData?.chiTietSanPham?.id || !formData.soLuong || !formData.chiTietSanPham.soLuong}> <i className="me-1 fa fa-shopping-basket"></i>Thêm vào giỏ hàng</button>}
                                        {currentUser && <button className={`btn btn-light border border-secondary py-2 icon-hover px-3 ${dataProduct.isFavourite && 'active'}`} onClick={() => dataProduct?.id && handleToggleFavourite(dataProduct?.id, getDataDetail, dataProduct.isFavourite)}> <i className="me-1 fa fa-heart fa-lg"></i></button>}
                                    </div>
                                </main>
                            </div>
                        </div>
                    </section>
                    {/* content */}

                    <section className="bg-light border-top py-4">
                        <div className="container">
                            <div className="row gx-4">
                                <div className="col-lg-8 mb-4">
                                    <div className="border rounded-2 px-8 py-3 bg-white">
                                        {/* Pills navs */}
                                        <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                                            <li className="nav-item d-flex" role="presentation">
                                                <a className="product-detail-nav nav-link d-flex align-items-center justify-content-center w-100 active bg-nav-gray" id="ex1-tab-1" data-bs-toggle="tab" data-bs-target="#ex1-pills-1" role="tab" aria-controls="ex1-pills-1" aria-selected="true">Thông tin chi tiết</a>
                                            </li>
                                            <li className="nav-item d-flex" role="presentation">
                                                <a className="product-detail-nav nav-link d-flex align-items-center justify-content-center w-100 bg-nav-gray" id="ex1-tab-2" data-bs-toggle="tab" data-bs-target="#ex1-pills-2" role="tab" aria-controls="ex1-pills-2" aria-selected="false">{`Đánh giá (${dataProduct.soLuotDanhGia})`}</a>
                                            </li>
                                            <li className="nav-item d-flex" role="presentation">
                                                <a className="product-detail-nav nav-link d-flex align-items-center justify-content-center w-100 bg-nav-gray" id="ex1-tab-3" data-bs-toggle="tab" data-bs-target="#ex1-pills-3" role="tab" aria-controls="ex1-pills-3" aria-selected="false">Thông tin giao hàng</a>
                                            </li>
                                        </ul>
                                        {/* Pills navs */}

                                        {/* Pills content */}
                                        <div className="tab-content" id="ex1-content">
                                            <div className="tab-pane fade show active" id="ex1-pills-1" role="tabpanel" aria-labelledby="ex1-tab-1">
                                                <p className="text-justify my-16 spaces line-height-20">
                                                    {dataProduct.moTa.split('\n').map((item, index) => <span key={index}>{item}<br /></span>)}
                                                </p>
                                                <div className="row mb-2">
                                                    <div className="col-12 col-md-4">
                                                        <ul className="list-unstyled mb-0">
                                                            <li><i className="fas fa-check text-success me-2"></i>Thiết kế độc đáo, phong cách</li>
                                                            <li><i className="fas fa-check text-success me-2"></i>Chất liệu cao cấp</li>
                                                            <li><i className="fas fa-check text-success me-2"></i>Thoải mái, thoáng mát</li>
                                                            <li><i className="fas fa-check text-success me-2"></i>Đóng gói cẩn thận</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-12 col-md-8 mb-0">
                                                        <ul className="list-unstyled">
                                                            <li><i className="fas fa-check text-success me-2"></i><strong>fullbox</strong> – hộp đựng sản phẩm nguyên bản từ nhà sản xuất</li>
                                                            <li><i className="fas fa-check text-success me-2"></i>Đế giày cao được làm từ cao su chất lượng cao, có độ bền cao và độ ma sát tốt</li>
                                                            <li><i className="fas fa-check text-success me-2"></i>Modern style and design</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade mb-2" id="ex1-pills-2" role="tabpanel" aria-labelledby="ex1-tab-2">
                                                <Comment maSanPham={dataProduct.id} />
                                            </div>
                                            <div className="tab-pane fade mb-2" id="ex1-pills-3" role="tabpanel" aria-labelledby="ex1-tab-3">
                                                <div className="shipping-info p-4">
                                                    <h4>🚚Giao Hàng Trong 1 - 2 Tuần</h4>
                                                    <p>Chúng tôi hiểu rằng việc nhận được sản phẩm mới của bạn một cách nhanh chóng và an toàn là điều quan trọng. Đó là lý do tại sao chúng tôi đã xây dựng một quy trình giao hàng đáng tin cậy, đảm bảo sản phẩm của bạn sẽ đến tay bạn trong khoảng <strong>1 đến 2 tuần</strong> kể từ thời điểm đặt hàng.</p>

                                                    <ul>
                                                        <li><strong>Cập Nhật Trạng Thái Thường Xuyên</strong>: Đội ngũ giao hàng của chúng tôi sẽ giữ bạn cập nhật mọi bước đi của gói hàng, từ lúc nó rời kho cho đến khi nó đến nơi.</li>
                                                        <li><strong>Bảo Đảm An Toàn</strong>: Mọi sản phẩm đều được bọc cẩn thận và đảm bảo trong suốt hành trình của nó để tránh hỏng hóc hoặc thất thoát.</li>
                                                        <li><strong>Linh Hoạt Trong Giao Nhận</strong>: Nếu bạn có bất kỳ yêu cầu đặc biệt hoặc cần thay đổi lịch giao hàng, chúng tôi sẵn lòng thích ứng để phù hợp với lịch trình của bạn.</li>
                                                    </ul>

                                                    <p><strong>🔔 Thông Báo Khi Giao Hàng</strong>: Bạn sẽ nhận được thông báo khi sản phẩm được giao đến địa chỉ của bạn, đảm bảo bạn sẽ không bỏ lỡ giây phút nhận hàng.</p>

                                                    <p>Chúng tôi cam kết mang đến sự hài lòng cho khách hàng trong mọi khía cạnh, từ chất lượng sản phẩm đến dịch vụ giao hàng. Nếu bạn có bất kỳ câu hỏi nào về quy trình giao hàng của chúng tôi hoặc cần trợ giúp về đơn hàng của mình, xin đừng ngần ngại liên hệ với chúng tôi.</p>

                                                    <p>🌟 Chúc bạn có trải nghiệm mua sắm tuyệt vời cùng chúng tôi!</p>
                                                </div>

                                            </div>
                                        </div>
                                        {/* Pills content */}
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="px-0 border rounded-2 shadow-0">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title mb-5">Sản phẩm tương tự</h5>
                                                {dataSimilar?.map((item: IProduct) =>
                                                    <Link to={`/detail/${item.id}`} className="nav-link d-flex mb-3 p-2 item-similar">
                                                        <div className="me-3 flex-shrink-0">
                                                            <img src={`${item.hinhAnh}`} className="img-md img-thumbnail spaces w-100 h-100" />
                                                        </div>
                                                        <div className="info">
                                                            <div className="mb-1">
                                                                {item?.tenSanPham}<br />
                                                                {item.category?.tenLoai}
                                                            </div>
                                                            <strong>{convertNumberPriceWithUnit(item.giaKhuyenMai ? item.giaKhuyenMai : item.giaTien)}</strong>
                                                        </div>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div> : <OderInfo handleback={() => setIsOdering(false)} dataProduct={[fakeDataCartItem]} total={fakeDataCartItem.giaBan * fakeDataCartItem.soLuong} />}
        </div>
    )
}

export { ProductDetails };
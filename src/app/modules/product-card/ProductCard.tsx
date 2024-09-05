import { FC } from "react";
import { Col } from "react-bootstrap";
import { Rating } from "@mui/material";
import { Link } from "react-router-dom";
import { IProduct } from "../product/models/ProductModel";
import { convertNumberPrice, convertNumberPriceWithUnit } from "../utils/FunctionUtils";

interface Iprops {
    data: IProduct;
    className?: string;
}

const ProductCard: FC<Iprops> = (props) => {
    const {
        data,
        className
    } = props;
    return (
        <Col>
            <div className={`product-card relative ${className}`}>
                {data?.giaKhuyenMai && <div className="spaces flex flex-end p-3 absolute-top-right z-index-10">
                    <div
                        className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center shadow-1-strong"
                        style={{ width: "35px", height: "35px" }}
                    >
                        <p className="text-white mb-0 small">Sale!</p>
                    </div>
                </div>}
                <Link to={`/detail/${data.id}`} title={data.tenSanPham} className="hover-zoom-img flex-grow-1">
                    <img className="product-card-img" src={data.hinhAnh} alt={data.tenSanPham} />
                </Link>
                <div className="spaces p-24">
                    <div className="d-flex justify-content-between">
                        <p className="small">
                            <Link to={`/${data?.category?.id || ""}`} className="text-muted">
                                {data.category?.tenLoai || null}
                            </Link>
                        </p>
                        <Rating name="half-rating" value={Number(data.soSaoTB) || 0} precision={0.5} readOnly />
                    </div>
                    <Link to={`/detail/${data.id}`} title={data.tenSanPham} className="d-flex justify-content-between mb-3">
                        <h3 className="mb-0 text-ellipsis">{data.tenSanPham}</h3>
                    </Link>
                    <s className="small text-danger h-sale-price">{data?.giaKhuyenMai && convertNumberPrice(data.giaTien)}</s>
                    <div className="d-flex justify-content-between mb-2">
                        <p className="mb-0 flex-shrink-0 text-primary">{convertNumberPriceWithUnit(data?.giaKhuyenMai ? data?.giaKhuyenMai : data.giaTien)}</p>
                        <p className="text-muted mb-0">
                            Đã bán: <span className="fw-bold">{data.tongSoBan}</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between mb-2">

                    </div>
                </div>
            </div>
        </Col>
    )
}

export { ProductCard };
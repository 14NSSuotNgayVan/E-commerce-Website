import { FC, useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { ProductCard } from "../product-card/ProductCard";
import { checkScreenSize } from "../utils/FunctionUtils";
import { IProduct } from "../product/models/ProductModel";

interface IDisplay {
    displayName: string;
}

interface IProps {
    data: IProduct[];
    rowSize?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    display?: IDisplay;
    rowDisplay?: number;
    className?: string;
}

const ProductContainer: FC<IProps> = (props) => {
    const {
        data,
        xs,
        sm,
        md,
        lg,
        xl,
        rowSize,
        display,
        rowDisplay,
        className
    } = props;
    const [displayRow, setDisplayRow] = useState<number>(rowDisplay || 0);
    const [colNumber, setColNumber] = useState<number>(rowSize || checkScreenSize(xs, sm, md, lg, xl) || 0);

    useEffect(() => {
        const handleResize = () => !rowSize && setColNumber(checkScreenSize(xs, sm, md, lg, xl));
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [lg, md, rowSize, sm, xl, xs])

    return (
        <div className={`spaces my-40 ${className || ""}`}>
            {display &&
                <div className="flex justify-content-between px-6">
                    <h3 className="spaces fw-500 fs-24 font-poppins line-height-18">{display.displayName}</h3>
                </div>
            }
            <Row xs={colNumber || 'auto'} sm={colNumber || 'auto'} md={colNumber || 'auto'} lg={colNumber || 'auto'} xl={colNumber || 'auto'} className="spaces p-30 row-gap-18">
                {
                    data.map((item: IProduct, index: number) => {
                        if (rowDisplay && colNumber && displayRow && index + 1 > displayRow * colNumber) return "";
                        return <ProductCard key={item.id} data={item} />
                    }
                    )
                }
            </Row>
            {rowDisplay && !!displayRow && colNumber && data.length > displayRow * colNumber && <div className="flex flex-center"><button type="button" onClick={() => setDisplayRow(0)} className="btn button-primary-outline-solid">Xem thêm</button></div>}
            {rowDisplay && !displayRow && <div className="flex flex-center"><button type="button" onClick={() => setDisplayRow(rowDisplay)} className="btn button-primary-outline-solid">Ẩn</button></div>}
        </div>
    )
}

export default ProductContainer;
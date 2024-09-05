import React, { FC, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "~/app/AppContext";
import { convertNumberPriceWithUnit, filterObject, numberExceptThisSymbols } from "../utils/FunctionUtils";
import { RESPONSE_STATUS_CODE } from "../utils/Constant";
import { toast } from "react-toastify";
import { deleteCart, updateCart } from "./services/ShoppingCartServices";
import { ICartItem } from "./models/ShoppingCartModels";
import { useTakeLatest } from "../component/CustomHook";
import ConfirmDialog from "../component/ConfirmDialog";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
interface IProps {
    className?: string,
    item: ICartItem,
    handleSearch: () => void
}

const ShoppingCartItem: FC<IProps> = (props) => {
    const {
        item,
        handleSearch
    } = props;
    const { lang } = useMultiLanguage();
    const { setPageLoading } = useContext(AppContext);
    const [data, setData] = useState<ICartItem>(item);
    const [soLuongMessage, setSoLuongMessage] = useState<string>("")
    const [shouldOpenConfirm, setShouldOpenConfirm] = useState<boolean>(false)
    const [loading, setLoading] = useState(false)

    const [handleUpdateCart, cancelUpdateCart] = useTakeLatest(async (item: ICartItem) => {
        try {
            setLoading(true);
            const { data } = await updateCart(filterObject(item));
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                handleSearch();
                setSoLuongMessage("")
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setLoading(false);
        }
    }, 500)

    const handleDeleteCartItem = async (id: string) => {
        try {
            setPageLoading(true);
            const { data } = await deleteCart(id);
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                handleSearch();
                setShouldOpenConfirm(false);
            }
        } catch (error) {
            toast.error(lang("GENERAL.ERROR"));
        } finally {
            setPageLoading(false);
        }
    }

    const handlePlusQuantity = () => {
        if (data.soLuong > data.productDetail.soLuong) {
            setSoLuongMessage("Vượt quá số lượng có trong kho của sản phẩm");
            return;
        }
        const dataUpdate = {
            ...data,
            soLuong: data.soLuong + 1,
        }
        setData(dataUpdate)
        handleUpdateCart(dataUpdate);
    }

    const handleChangeQuantity = (value: number) => {
        const dataUpdate = {
            ...data,
            soLuong: value,
        }

        setData(dataUpdate)
        if (value > item.productDetail.soLuong) {
            setSoLuongMessage("Vượt quá số lượng có trong kho của sản phẩm");
            return;
        }
        if(!value) return;
        handleUpdateCart(dataUpdate);
    }

    const handleMinusQuantity = () => {
        if (data.soLuong === 1) {
            setShouldOpenConfirm(true);
            return;
        }

        const dataUpdate = {
            ...data,
            soLuong: data.soLuong - 1,
        }

        setData(dataUpdate)
        handleUpdateCart(dataUpdate);
    }

    useEffect(() => {
        setData(item);
    }, [item]);

    return (
        <div className="row mb-4 flex-middle">
            <div className="col-lg-6">
                <Link to={`/detail/${item.productDetail.product.id}`} className="nav-link d-flex">
                    <img src={item.productDetail.hinhAnh || item.productDetail.product.hinhAnh} className="border rounded me-3 spaces w-100 h-100" />
                    <div className="">
                        <a href="#" className="nav-link">{item.productDetail.product?.tenSanPham}</a>
                        <p className="text-muted">{item.productDetail?.color?.tenMau}, {item.productDetail?.size?.tenKichThuoc}</p>
                    </div>
                </Link>
            </div>
            <div className="col-lg-5 col-sm-8 col-10 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
                <div className="input-group mb-3 spaces w-150 flex mr-18">
                    <button className="border border-secondary spaces h-36" type="button" id="button-addon1" data-mdb-ripple-color="dark" onClick={() => handleMinusQuantity()} disabled={data.soLuong < 1 || loading}>
                        <i className="fas fa-minus"></i>
                    </button>
                    <input 
                        type="number" 
                        min={0} className="form-control text-center border border-secondary spaces h-36 w-60 number-no-spin" 
                        value={data.soLuong ?? ""} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeQuantity(Number(e.target.value))} 
                        onKeyDown={numberExceptThisSymbols}
                        disabled={loading}
                        aria-label="Example text with button addon" aria-describedby="button-addon1" 
                    />
                    <button className="border border-secondary spaces h-36" type="button" id="button-addon2" data-mdb-ripple-color="dark" onClick={() => handlePlusQuantity()} disabled={loading}>
                        <i className="fas fa-plus"></i>
                    </button>
                    <div className="text-danger spaces fs-10">{soLuongMessage}</div>
                </div>
                <div className="">
                    <text className="h6">{convertNumberPriceWithUnit(item.giaBan * item.soLuong)}</text> <br />
                    <small className="text-muted text-nowrap"> {convertNumberPriceWithUnit(item.giaBan)} / mỗi sản phẩm</small>
                </div>
            </div>
            <div className="col-lg-1 col-sm-4 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2">
                <div className="float-md-end">
                    <button className=" icon-hover-danger btn btn-light border text-danger" onClick={() => setShouldOpenConfirm(true)}>Xóa</button>
                </div>
            </div>
            <ConfirmDialog view={shouldOpenConfirm} onYesClick={() => handleDeleteCartItem(item.id)} onCancelClick={() => setShouldOpenConfirm(false)} Description={"Bạn chắc chắn muốn xóa ?"} />
        </div>

    )
}

export default ShoppingCartItem;
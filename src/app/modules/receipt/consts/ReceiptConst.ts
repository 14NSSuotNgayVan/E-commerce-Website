import { IReceipt } from "../models/ReceiptModel";
import moment from 'moment';

export const initReceipt: IReceipt = {
    id: "",
    maNhaCungCap: "",
    supplier: null,
    tenPhieu: "",
    ngayNhap: moment().format("YYYY-MM-DD"),
    ghiChu: "",
    xacNhanNhapKho: false
}
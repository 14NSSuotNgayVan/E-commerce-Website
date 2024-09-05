import { IPromotion } from "../models/PromotionModel";

export const PROMOTION_STATUS_CODE = {
    WAITING: 1,
    IN_PROGRESS: 2,
    FINISHED: 3
}

export const TRANG_THAI_KHUYEN_MAI = [
    { code: 1, name: "Chưa áp dụng", styleClass: "warning" },
    { code: 2, name: "Đang diễn ra", styleClass: "success" },
    { code: 3, name: "Đã kết thúc", styleClass: "light" }
]

export const initPromotion: IPromotion = {
    id: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    tenKhuyenMai: "",
    trangThai: null,
}
import { OptionReactSelect } from "../models/models"

export const RESPONSE_STATUS_CODE = {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
}

export enum TYPE {
    FUNCTION = "function",
    OBJECT = "object",
    STATUS = "status",
    STRING = "string",
    TEXT = "text",
    NUMBER = "number",
    INPUT = "input",
    DATE = "date",
    TEXTAREA = "textarea",
    SELECT = "select",
    SINGLE = "single",
    MULTILINE = "multiline",
    MODULE = "module",
    PASSWORD = "password"
}

export const REGEX = {
    TEN: /^[^~`!@#$%^&*()+=\-[\]\\';,/{}|\\":._<>?\d]+$/,
    AZ_09: /^[a-zA-Z0-9]*$/,
    CHARACTER20: /^.{6,20}$/,
    CHARACTER9or12: /^\d{9}(\d{3})?$/,
    CHARACTER10or13: /^\w{10}(\w{3})?$/,
    CHARACTER50: /^.{1,50}$/,
    CHARACTER255: /^.{1,255}$/,
    YEAR: /^.{4,5}$/,
    PERCENTAGE: /^(-?\d{1,4})(\.\d{1,2})?$/,
    MA_SO_THUE: /^[0-9]{10}$/,
    NUMBER: /^[0-9]+$/,
    NOT_ZERO: /^[0-9]*[1-9][0-9]*$/,
    USER_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,16}$/,
    CHECK_PHONE: /^(0|\+84)\d{9}$/,
    LETTER_ONLY: /^[^~`!@#$%^&*()+=\-[\]\\';,/{}|\\":._<>?\d]+$/,
    LETTER_OR_NUMBER_ONLY: /^[^~`!@#$%^&*()+=\-[\]\\';,/{}|\\":._<>?]+$/,
    ADDRESS: /^[^~`!@#$%^&*()+=\-[\]\\';/{}|\\":_<>?]+$/,
    USERNAME: /^[a-z](?:[a-z]+\d*|\d{2,})$/
}
export const DATE = {
    MAX_DATE: new Date(9999, 12, 31),
    MIN_DATE: new Date(1900, 0, 1),
}

export const NUMBER_EXCEPT_THIS_SYMBOLS = ["e", "E", "+", "-", "."]
export const JUST_ALLOW_NUMBER = ["e", "E", "+", "-", ".", ","]
export const DEFAULT_PAGE_INDEX = 1
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_TOTAL_PAGES = 0
export const DEFAULT_TOTAL_ELEMENTS = 0
export const MAX_PAGE_SIZE = 99999

export const SEARCH_OBJECT_MAX_SIZE = {
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: MAX_PAGE_SIZE,
}

export const KEY = {
    ENTER: 'Enter',
    SPACE: 'Space',
}

export const VARIABLE_STRING = {
    CHUYEN_NGANH: "chuyenNganh",
    CHUYEN_NGANH_KHAC: "chuyenNganhKhac",
    NOI_DAO_TAO: "noiDaoTao",
    CHUYEN_NGANH_ID: "chuyenNganhId",
    NOI_DAO_TAO_ID: "noiDaoTaoId",
    QUOC_TICH_ID: "quocTichId",
    DAN_TOC_ID: "danTocId",
    TON_GIAO_ID: "tonGiaoId",
    HK_QUOC_GIA: "hkQuocGia",
    HK_TINH: "hkTinh",
    HK_HUYEN: "hkHuyen",
    HK_XA: "hkXa",
    HK_SO_NHA: "hkSoNha",
    HN_QUOC_GIA: "hnQuocGia",
    HN_TINH: "hnTinh",
    HN_HUYEN: "hnHuyen",
    HN_XA: "hnXa",
    HN_SO_NHA: "hnSoNha",
    TT_TINH: "ttTinh",
    TT_HUYEN: "ttHuyen",
    TT_XA: "ttXa",
    TRINH_DO_DAO_TAO: "trinhDoDaoTao",
    NHOM_CHUNG_CHI: "nhomChungChi",
    DON_VI_CONG_TAC: "donViCongTac",
    DON_VI_CONG_TAC_ID: "donViCongTacId",
    PHONG_BAN: "phongBan",
    PHONG_BAN_KHAC: "phongBanKhac",
    VI_TRI_CONG_VIEC: "viTriCongViec",
    VI_TRI_CONG_VIEC_ID: "viTriCongViecId",
    CHUC_DANH: "chucDanh",
    CAP: "cap",
    BAC: "bac",
    TRANG_THAI_LAO_DONG: "trangThaiLaoDong",
    LOAI_HOP_DONG: "loaiHopDong",
    NGUOI_QUAN_LY: "nguoiQuanLy",
    NGAN_HANG: "nganHang",
    TINH_DANG_KY_KCB: "tinhDangKyKhamChuaBenh",
    NOI_Dang_KY_KCB: "noiDangKyKcb",
    MA_NOI_Dang_KY_KCB: "maSoNoiDangKyKcb",
    DOAN_VIEN: "doanVien",
    DANG_VIEN: "dangVien",
    NGOAI_CHI_BO_QUAN_LY: "ngoaiChiBoQuanLy",
    HIEN_NAY_DA_ROI_DANG: "hienNayDaRoiDang",
    CHUC_VU_DOAN: "chucVuDoan",
    CHUC_VU: "chucVu",
    CHUC_VU_ID: "chucVuId",
    CHUC_VU_DANG: "chucVuDang",
    CHUC_VU_MOI: "chucVuMoi",
    CHUC_VU_MOI_KHAC: "chucVuMoiKhac",
    CHUC_VU_MOI_ID: "chucVuMoiId",
    HN_GIONG_HO_KHAU: "hnGiongHoKhau",
    HK_LA_CHU_HO: "hkLaChuHo",
    TINH_CHAT_LAO_DONG: "tinhChatLaoDong",
    BINH_CHUNG: "binhChung",
    CAP_BAC_QUAN_SU: "capBacQuanSu",
    CHUC_VU_QUAN_SU: "chucVuQuanSu",
    HANG_THUONG_BINH: "hangThuongBenhBinh",
    NHOM_COLOR: "nhomMau",
    QUOC_TICH: "quocTich",
    HK_DIA_CHI: "hkDiachi",
    HN_DIA_CHI: "hnDiachi",
    TT_DIA_CHI: "ttDiachi",
    NGAY_NGHI_VIEC: "ngayNghiViec",
    LY_DO_NGHI: "lyDoNghi",
    THANG_KHAU_TRU_OPTION: "thangKhauTruOption",
    NAM_KHAU_TRU_OPTION: "namKhauTruOption",
    QQ_TINH: "queQuanTinh",
    QQ_HUYEN: "queQuanHuyen",
    QQ_XA: "queQuanXa",
    NS_TINH: "noiSinhTinh",
    NS_HUYEN: "noiSinhHuyen",
    NS_XA: "noiSinhXa",
    QQ_DCCT: "queQuanDiaChiChiTiet",
    NS_DCCT: "noiSinhDiaChiChiTiet",
    NGAY_HET_HAN: "ngayHetHan",
    NGAY_CO_HIEU_LUC: "ngayCoHieuLuc",
    NGUOI_DAI_DIEN_KY: "nguoiDaiDienCtyKy",
    EMPLOYEE: "employee",
    EMPLOYEE_CODE: "employeeCode",
    VIEN_CHUC: "vienChuc",
    HOP_DONG_LAO_DONG: "hopDongLaoDong",
    DON_VI_KY_HOP_DONG: "donViKyHopDong",
    DON_VI: "donVi",
    CA_LAM_VIEC: "caLamViec",
    TRANG_THAI: "trangThai",
    TRANG_THAI_KY: "trangThaiKy",
    NOI_DAO_TAO_KHAC: "noiDaoTaoKhac",
    CO_SO_DAO_TAO: "coSoDaoTao",
    CO_SO_DAO_TAO_KHAC: "coSoDaoTaoKhac",
    DON_VI_CONG_TAC_KHAC: "donViCongTacKhac",
    DON_VI_CONG_TAC_MOI: "donViCongTacMoi",
    DON_VI_CONG_TAC_MOI_ID: "donViCongTacMoiId",
    VI_TRI_CONG_TAC_MOI: "viTriCongTacMoi",
    VI_TRI_CONG_TAC_MOI_ID: "viTriCongTacMoiId",
    LOAI_CAN_BO: "loaiCanBo",
    LOAI_LUONG: "loaiLuong",
    VIET_NAM: "Việt Nam",
    HE_SO_LUONG: "heSoLuong",
    HE_SO_BAC_LUONG: "heSoBacLuong",
    LUONG_CO_BAN: "luongCoBan",
    BAC_LUONG: "bacLuong",
    BAC_LUONG_OPTION: "bacLuongOption",
    TRANG_THAI_HOP_DONG: "trangThaiHopDong",
    UNEXPORED: "unexpired",
    DUE: "due",
    OUT_OF_DATE: "outOfDate",
    FEMALE: "female",
    MALE: "male",
    NO_INFO: "noInfo",
    QUOC_GIA: "nationality",
    QUAN_HE_NV: "quanHeNV",
    QUAN_HE_NV_ID: "quanHeNVId",
    QUAN_HE_NV_TEXT: "quanHeNVText",
    HOP_DONG_GOC: "hopDongGoc",
    NGAY_HUONG_LUONG_TU: "ngayHuongLuongTuNgay",
    NGAY_HUONG_LUONG_DEN: "ngayHuongLuongDenNgay",
    GENDER: "gender",
    CANH_BAO_HET_HAN_HOP_DONG: "canhBaoHetHanHopDong",
    CANH_BAO_DEN_HAN_NANG_LUONG: "canhBaoHetHanNangLuong",
    CANH_BAO_NHAN_SU_DEN_TUOI_NGHI_HUU: "canhBaoNhanSuDenTuoiNghiHuu",
    CANH_BAO_DEN_HAN_VAN_BANG_CHUNG_CHI: "canhBaoDenHanVanBangChungChi",
    CANH_BAO_HET_HAN_LUAN_CHUYEN: "canhBaoHetHanLuanChuyen",
    NGANH_DAO_TAO: "nganhDaoTao",
    NGANH_DAO_TAO_KHAC: "nganhDaoTaoKhac",
    CHUYEN_NGANH_DAO_TAO: "chuyenNganhDaoTao",
    CHUYEN_NGANH_DAO_TAO_KHAC: "chuyenNganhDaoTaoKhac",
    NUOC_DAO_TAO: "nuocDaoTao",
    NUOC_DAO_TAO_KHAC: "nuocDaoTaoKhac",
    CAP_CHUNG_CHI: "capChungChi",
    VAN_BANG: "vanBang",
    NGAY_CAP: "ngayCap",
    DON_VI_CAP: "donViCap",
    HIEU_LUC_BAT_DAU: "hieuLucBatDau",
    HIEU_LUC_KET_THUC: "hieuLucKetThuc",
    CHUNG_CHI_QUOC_TE: "chungChiQuocTe",
    KHOA_PHONG: "khoaPhong",
    KHOA_PHONG_ID: "khoaPhongId",
    PHONG_BAN_MOI: "phongBanMoi",
    PHONG_BAN_MOI_KHAC: "phongBanMoiKhac",
    KHOA_PHONG_MOI_ID: "phongBanMoiId",
    HIEU_LUC_TU_NGAY: "hieuLucTuNgay",
    HIEU_LUC_DEN_NGAY: "hieuLucDenNgay",
    PHIEU_LUONG_XAC_NHAN: "phieuLuongXacNhan",
    BO_SUNG_HO_SO: "boSungHoSo",
    LOAI_THOI_VIEC: "loaiThoiViec",
    LOAI_THOI_VIEC_BAO_HIEM: "loaiThoiViecBH",
    LOAI_NGHI: "loaiNghi",
    LOAI_GIAN_DOAN: "loaiGianDoan",
    HINH_THUC_DIEU_CHINH: "hinhThucDieuChinh",
    LOAI_BO_NHIEM: "loaiBoNhiem",
    DOT_KHEN_THUONG: "doiTuongKhenThuong",
    LOAI_KHEN_THUONG: "loaiKhenThuong",
    HINH_THUC_KHEN_THUONG: "hinhThucKhenThuong",
    DANH_HIEU_THI_DUA: "danhHieuThiDua",
    DANH_HIEU_THI_DUA_KHAC: "danhHieuThiDuaKhac",
    CAP_QUYET_DINH: "capQuyetDinh",
    DON_VI_BAN_HANH: "donViBanHanh",
    LOAI_KY_LUAT: "loaiKyLuat",
    HINH_THUC_KY_LUAT: "hinhThucKyLuat",
    NGUOI_KY_QUYET_DINH: "nguoiKyQuyetDinh",
    CO_QUAN_QUYET_DINH: "coQuanQuyetDinh",
    CHUYEN_NGANH_HOC_HAM_KHAC: "chuyenNganhHocHamKhac",
    CHUYEN_NGANH_HOC_HAM: "chuyenNganhHocHam",
    HOC_HAM: "hocHam",
    DANH_HIEU: "danhHieu",
    CHINH_SACH: "chinhSach",
    HANG_THUONG_BINH2: "hangThuongBinh",
    HINH_THUC_KHEN_THUONG_ID: "hinhThucKhenThuongId",
    DOI_TUONG_KHEN_THUONG: "doiTuongKhenThuong",
    NHAN_VIEN_ID: "employeeId",
    CO_SO_SO_BHXH: "coSoBhxhHayChua",
    SO_SO_BHXH: "soSoBhxh",
    TRANG_THAI_THAM_GIA_BAO_HIEM: "trangThaiThamGiaBaoHiem",
    LUONG_THEO_HE_SO: "luongTheoHeSo",
    PHU_CAP_THAM_NIEN_NGHE: "phuCapThamNienNghe",
    PHU_CAP_THAM_NIEN_VUOT_KHUNG: "phuCapThamNienVuotKhung",
    MUC_LUONG: "mucLuong",
    PHU_CAP_LUONG: "phuCapLuong",
    CAC_KHOAN_BO_SUNG: "cacKhoanBoSung",
    DON_VI_THAM_GIA_BHXH: "donViThamGiaBhxh",
    CONG_TAC_VIEN_NAME: "Cộng tác viên",
    YEAR: "year",
    QUY: "quy",
    HUONG_LUONG_TAP_SU: "Hưởng lương tập sự",
    LOAI_DIEU_CHINH_LUONG: "loaiDieuChinhLuong",
    ANH_HUONG_THOI_GIAN_DIEU_CHINH_LUONG: "ahtgDieuChinhLuong",
    NHOM_PHUC_LOI: "nhomPhucLoi",
    DON_VI_AP_DUNG: "donViApDung",
    HINH_THUC_THUC_HIEN: "hinhThucThucHien",
    TEN_NGUOI_DUYET: "tenNguoiDuyet",
    NGUOI_DUYET: "nguoiDuyet",
    QUAN_HE: "quanHe",
    NGAY_HIEU_LUC: "ngayHieuLuc",
    THOI_GIAN_HIEU_LUC_TU_NGAY: "thoiGianHieuLucTuNgay",
    USER_ROLE: "user.role"
}

export const SELECTION_MODE = {
    SINGLE: "single",
    MULTIPLE: "multiple"
}

export const COUNTRY = {
    CODE: {
        VIET_NAM: "VN"
    }
}

export const LIST_MONTH: OptionReactSelect[] = [
    {
        code: 1,
        name: "Tháng 1",
    },
    {
        code: 2,
        name: "Tháng 2"
    },
    {
        code: 3,
        name: "Tháng 3"
    },
    {
        code: 4,
        name: "Tháng 4"
    },
    {
        code: 5,
        name: "Tháng 5"
    },
    {
        code: 6,
        name: "Tháng 6"
    },
    {
        code: 7,
        name: "Tháng 7"
    },
    {
        code: 8,
        name: "Tháng 8"
    },
    {
        code: 9,
        name: "Tháng 9"
    },
    {
        code: 10,
        name: "Tháng 10"
    },
    {
        code: 11,
        name: "Tháng 11"
    },
    {
        code: 12,
        name: "Tháng 12"
    },
]

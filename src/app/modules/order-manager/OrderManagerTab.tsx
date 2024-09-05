import { checkStatus, convertNumberPrice, formatDateParam, formatDateTable } from "../utils/FunctionUtils";
import { priceUnitDefault } from "../constant";
import { STATUS_ORDER, oderStatus } from "../oder-info/constants/oderInfoConstants";
import TabMenu from "../component/tabs/TabMenu";
import { ORDER_MANAGER_TAB } from "./constants/OrderManagerConstants";
import OrderManager from "./OrderManager";

function OrderManagerTab() {

    const ColumnsOder = (orderStatus: number, handleShowModal: (item: any) => void) => {

        return [
            {
                name: "STT",
                field: "",
                headerStyle: {
                    minWidth: "40px",
                },
                render: (row: any, index: number, numericalOrder: number, itemList: any) => <span>{numericalOrder}</span>,
            },
            {
                name: "Trạng thái đơn hàng",
                field: "trangThaiDonHang",
                headerStyle: {
                    minWidth: "200px",
                },
                render: (row: any, index: number, numericalOrder: number, itemList: any) => <span className={`ms-2 rounded-pill py-1 px-2 ${checkStatus(STATUS_ORDER, row.trangThaiDonHang?.code)}`}>{row.trangThaiDonHang?.name}</span>,
            },
            ...(orderStatus === oderStatus.choXuLy || orderStatus === oderStatus.choThanhToan ? [
                {
                    name: "Xác nhận đơn hàng",
                    field: "",
                    headerStyle: {
                        minWidth: "200px",
                    },
                    render: (row: any, index: number, numericalOrder: number, itemList: any) => <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleShowModal(row)}>Xác nhận</button>,

                }
            ] : []),
            ...(orderStatus === oderStatus.chuanBiHang ? [
                {
                    name: "Xác nhận giao hàng",
                    field: "",
                    headerStyle: {
                        minWidth: "200px",
                    },
                    render: (row: any, index: number, numericalOrder: number, itemList: any) => <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => handleShowModal(row)}>Xác nhận</button>,

                }
            ] : []),
            {
                name: "Tên khách hàng",
                field: "customer",
                headerStyle: {
                    minWidth: "150px",
                },
                render: (row: any, index: number, numericalOrder: number, itemList: any) => row.customer?.tenKhachHang,

            },
            {
                name: "Mã đơn hàng",
                field: "id",
                headerStyle: {
                    minWidth: "200px",
                },
            },
            {
                name: "Phương thức thanh toán",
                field: "payment",
                headerStyle: {
                    minWidth: "170px",
                },
                render: (row: any, index: number, numericalOrder: number, itemList: any) => row.payment?.tenPhuongThuc,
            },
            {
                name: "Ngày đặt hàng",
                field: "ngayDatHang",
                headerStyle: {
                    minWidth: "150px",
                },
                render: (row: any, index: number, numericalOrder: number, itemList: any) => formatDateTable(row?.ngayDatHang),
            },
            ...(orderStatus === oderStatus.biHuy ?
                [{
                    name: "Ngày hủy đơn",
                    field: "ngayHuyDon",
                    headerStyle: {
                        minWidth: "150px",
                    },
                    render: (row: any, index: number, numericalOrder: number, itemList: any) => formatDateTable(row?.ngayHuyDon),
                },
                {
                    name: "Lí do hủy đơn",
                    field: "lyDoHuy",
                    headerStyle: {
                        minWidth: "200px",
                    },
                }] : []),

            {
                name: "Tổng số lượng",
                field: "tongSoLuong",
                headerStyle: {
                    minWidth: "110px",
                },
            },
            {
                name: "Tổng giá tiền " + priceUnitDefault,
                field: "tongGiaTien",
                headerStyle: {
                    minWidth: "150px",
                },
                render: (row: any, index: number, numericalOrder: number, itemList: any) => convertNumberPrice(row.tongGiaTien),
            },
            {
                name: "Ghi chú",
                field: "ghiChu",
                headerStyle: {
                    minWidth: "200px",
                },
            },
        ]
    };
    const DS_TAB = [
        {
            eventKey: ORDER_MANAGER_TAB.CHUA_THANH_TOAN,
            title: "Đơn hàng chờ thanh toán",
            component: (dependencies: any) =>
                <OrderManager column={ColumnsOder} trangThaiDonHang={oderStatus.choThanhToan} />
        },
        {
            eventKey: ORDER_MANAGER_TAB.CHO_XU_LY,
            title: "Đơn hàng chờ xử lý",
            component: (dependencies: any) =>
                <OrderManager column={ColumnsOder} trangThaiDonHang={oderStatus.choXuLy} />
        },
        {
            eventKey: ORDER_MANAGER_TAB.DANG_CHUAN_BI_HANG,
            title: "Đơn hàng đang chuẩn bị",
            component: (dependencies: any) =>
                <OrderManager column={ColumnsOder} trangThaiDonHang={oderStatus.chuanBiHang} />
        },
        {
            eventKey: ORDER_MANAGER_TAB.DANG_GIAO,
            title: "Đơn hàng đang được giao",
            component: (dependencies: any) =>
                <OrderManager column={ColumnsOder} trangThaiDonHang={oderStatus.DangDuocGiao} />
        },
        {
            eventKey: ORDER_MANAGER_TAB.GIAO_HANG_THANH_CONG,
            title: "Đơn hàng giao thành công",
            component: (dependencies: any) =>
                <OrderManager column={ColumnsOder} trangThaiDonHang={oderStatus.giaoThanhCong} />
        },
        {
            eventKey: ORDER_MANAGER_TAB.BI_HUY,
            title: "Đơn hàng bị hủy",
            component: (dependencies: any) =>
                <OrderManager column={ColumnsOder} trangThaiDonHang={oderStatus.biHuy} />
        },
    ]

    return (
        <div className="spaces my-40">
            <TabMenu danhsachTabs={DS_TAB} isScrollTab={true} id={'oder-manager-tab'} />
        </div>
    );
}

export default OrderManagerTab;

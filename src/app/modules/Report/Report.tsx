import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { ReportModal } from "./ReportModal";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import AppContext from "~/app/AppContext";
import { RESPONSE_STATUS_CODE, TYPE } from "../utils/Constant";
import InputSearch from "../component/input-field/InputSearch";
import { filterObject, formatDateVN, hasAuthority } from "../utils/FunctionUtils";
import { deleteReport, searchReport } from "./services/ReportServices";
import TableCustom from "../component/table-custom/TableCustom";
import { Modal } from "react-bootstrap";
import { PERMISSIONS, PERMISSION_ABILITY } from "~/app/constants/Common";

function Report() {
    const intl = useIntl();
    const { lang } = useMultiLanguage();
    const title = "GENERAL.REPORT";
    const { setPageLoading } = useContext(AppContext);
    const [item, setItem] = useState<any>({});
    const [dataDepartment, setDataDepartment] = useState<any[]>([]);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);
    const [isShowFile, setIsShowFile] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
    });

    const handleShowFile = (item: any = {}) => {
        setIsShowFile(true);
        setItem({ ...item });
    };

    const handleCloseFile = () => {
        setItem({});
        setIsShowFile(false);
    };

    const ColumnsDepartment = [
        {
            name: "STT",
            field: "",
            headerStyle: {
                minWidth: "40px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <span>{numericalOrder}</span>,
        },
        {
            name: "Tên báo cáo",
            field: "tenBaoCao",
            headerStyle: {
                minWidth: "100px",
            },
            cellStyle: {
                textAlign: "left"
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <span className="line-clamp-3">{row?.tenBaoCao}</span>,
        },
        {
            name: "Kết quả báo cáo",
            field: "ketQuaPhanTich",
            headerStyle: {
                minWidth: "100px",
            },
            cellStyle: {
                textAlign: "left"
            },
            render: (row: any) => row?.ketQuaPhanTich?.split("\n").map((item: any, index: number) => <p key={index} className="mb-1">{item}</p>),
        },
        {
            name: "Ngày tạo",
            field: "createAt",
            headerStyle: {
                minWidth: "100px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => formatDateVN(row.createAt),
        },
        {
            name: "Xem báo cáo",
            field: "file",
            headerStyle: {
                minWidth: "200px",
            },
            render: (row: any, index: number, numericalOrder: number, itemList: any) => <button className="btn btn-primary" onClick={() => { handleShowFile(row) }}>Xem</button>,

        },
    ];

    const handleShowModal = (item: any = {}) => {
        setIsShowModal(true);
        setItem({ ...item });
    };

    const handleCloseModal = () => {
        setItem({});
        setIsShowModal(false);
    };

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setPageLoading(true);
            const { data } = await searchReport(filterObject(searchObject));
            setTotalPage(data?.data?.totalPages);
            setTotalElements(data?.data?.totalElements);
            setNumberOfElements(data?.data?.numberOfElements);

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setDataDepartment(data?.data?.content);
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

    const handleDeleteRows = async (ids: string) => {
        try {
            setPageLoading(true);
            const { data } = await deleteReport(ids);
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                toast.success("Thành công");
                handleSearch();
            } else toast.error(data.message);
        } catch (error) {
            toast.error(lang(lang("GENERAL.ERROR")));
        } finally {
            setPageLoading(false);
        }
    }

    return (
        <div className="">
            <div className={`bg-white mt-2 p-2 spaces my-40`}>
                <div className="header-container bg-white flex flex-space-between">
                    <span className="spaces fs-18 fw-bold text-uppercase">{intl.formatMessage({ id: title })}</span>
                    <div className="flex flex-middle">
                        <InputSearch
                            className="flex-row spaces w-300 h-30"
                            value={searchObject.keyword || ""}
                            type="text"
                            placeholder="Tìm kiếm"
                            isEnter={true}
                            handleSearch={handleSearch}
                            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchObject({ ...searchObject, keyword: e.target?.value }); }}
                        />
                    </div>
                </div>
                <div className="table-custom">
                    <TableCustom
                        id="report"
                        data={dataDepartment || []}
                        page={searchObject?.pageIndex}
                        columns={ColumnsDepartment}
                        notDelete={!hasAuthority(PERMISSIONS.REPORT,PERMISSION_ABILITY.DELETE)}
                        updatePageData={handleSearch}
                        totalPages={totalPage}
                        totalElements={totalElements}
                        numberOfElements={numberOfElements}
                        rowsPerPage={searchObject?.pageSize}
                        isActionTableTab={false}
                        type={TYPE.MULTILINE}
                        noToolbar={hasAuthority(PERMISSIONS.REPORT,PERMISSION_ABILITY.DELETE)}
                        buttonAdd={hasAuthority(PERMISSIONS.REPORT,PERMISSION_ABILITY.CREATE)}
                        handleOpenDialog={(e: any) => {
                            e.preventDefault();
                            handleShowModal();
                        }}
                        handleDoubleClick={(row : any) => { hasAuthority(PERMISSIONS.REPORT,PERMISSION_ABILITY.UPDATE) && handleShowModal(row)}}
                        handleDelete={handleDeleteRows}
                    />
                </div>
            </div>
            {isShowModal && <ReportModal handleCloseModal={handleCloseModal} handleSearch={handleSearch} item={item} setItem={setItem} />}
            {isShowFile && item.file &&
                <Modal
                    show={true}
                    centered
                    aria-labelledby="example-custom-modal-styling-title"
                    className="modal-w-90"
                    onHide={handleCloseFile}
                >
                    <Modal.Header closeButton>
                        <Modal.Title
                            id="example-custom-modal-styling-title"
                            className="heading-5"
                        >
                            {item.tenBaoCao}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 h-90vh">
                        <iframe className="w-100 h-100 report-view"
                            src={item.file.replace(".pdf", ".jpg")}>
                        </iframe>
                    </Modal.Body>
                    <Modal.Footer className="flex-center">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseFile}>{lang("BTN.CLOSE")}</button>
                    </Modal.Footer>
                </Modal>
            }
        </div >
    );
}

export default Report;

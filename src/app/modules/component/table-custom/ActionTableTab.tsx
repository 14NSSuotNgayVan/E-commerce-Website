import React from 'react'
import { KTSVG } from '../../../../_metronic/helpers';
import { useIntl } from 'react-intl';


function ActionTableTab(props: any) {
    const intl = useIntl();

    const {
        title,
        buttonAdd,
        buttonExportExcel,
        handleOpenDialog,
        handleExportExcel,
        selectedRows,
        handleCheckBoxAll,
        notDelete,
        setShouldOpenConfirmDeleteDialog
    } = props;
    return (
        <div className='flex flex-space-between'>
            <span className="spaces fs-18 text-header-table fw-600 ">{title}</span>
            <div className="spaces p-0 d-flex align-items-center">
                {selectedRows?.length > 0 && (
                    <>
                        <span className="spaces mr-8">
                            {intl.formatMessage({ id: "SELECTED" })}:
                            <strong className="ps-2">
                                {selectedRows ? selectedRows?.length : 0}
                            </strong>
                        </span>
                        <span
                            className="spaces mr-16 fw-bold text-warning cursor-pointer "
                            onClick={() => handleCheckBoxAll(false)}
                        >
                            {intl.formatMessage({ id: "UNSELECTED" })}
                        </span>
                        {!notDelete &&
                            <div
                                className="delete-box cursor-pointer spaces mr-8"
                                onClick={(e) => setShouldOpenConfirmDeleteDialog(true)}
                            >
                                <i className="bi bi-trash fs-4 text-danger px-4"></i>
                                <span className="fw-bold text-danger">
                                    {intl.formatMessage({ id: "DELETE" })}
                                </span>
                            </div>
                        }
                    </>
                )}
                {
                    buttonAdd &&
                    <button
                        className="spaces button-primary flex flex-middle mx-8"
                        onClick={(e: any) => {
                            e.preventDefault();
                            handleOpenDialog();
                        }}
                    >
                        <i className="spaces bi bi-plus fs-20 white"></i>
                        <p className="spaces fs-14 m-0 ">Thêm mới</p>
                    </button>
                }

                {
                    buttonExportExcel &&
                    <button
                        className="flex flex-middle table-btn outline"
                        onClick={() => {
                            const ids = selectedRows?.map((row: any) => row?.id)?.toString()
                            handleExportExcel && handleExportExcel(ids);
                        }}
                    >
                        <KTSVG path="/media/icons/export-excel.svg" />{" "}
                        {intl.formatMessage({ id: "BTN.EXPORT" })}
                    </button>
                }
            </div>

        </div>
    )
}

export default ActionTableTab
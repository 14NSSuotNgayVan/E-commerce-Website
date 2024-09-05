import { KTSVG } from "../../../_metronic/helpers"
import { TYPE_CATEGORY } from "../constant"

type TFilterTree = {
    id?: string
    name: string
    code: string
    quantity?: number
}

type TTree = {
    id?: string,
    code: string,
    name: string,
    filter?: TFilterTree[]
}

type TSelectTree = {
    id?: string,
    code?: string,
    name?: string,
    filter?: TTree[]
}

type TProps = {
    className?: string
    codeCollapses: string[]
    handleChangeCollapsesCode: React.Dispatch<React.SetStateAction<string[]>>
    idSelected: string
    handleChangeSelectId: React.Dispatch<React.SetStateAction<string>>
    selectTree: TSelectTree[];
    handleRow: (row: any) => void;
    isTotal?: boolean;
}

function Collapse(props: any) {
    const { item, handleCollapse, codeCollapses, handleRow, isTotal, idSelected, handleChangeSelectId } = props;
    const isChildren = item?.filter && item?.filter?.length > 0;

    return (
        <div
            className={`spaces rowTreeSelect fs-14 h-24 color-gunmetal d-flex flex-middle relative ${item?.id === idSelected ? "active" : ""}`}
            onClick={async () => {
                await handleRow(item)
                handleChangeSelectId(item?.id);
                handleCollapse(item.code);
            }}
        >
            <div>
                {(isChildren || item.type === TYPE_CATEGORY.donVi) && (codeCollapses.includes(item.code)
                    ? (<div className="spaces w-15"><i className="bi bi-caret-down-fill text-black"></i></div>)
                    : (<div className="spaces w-15"><i className="bi bi-caret-right-fill text-black"></i></div>))}
            </div>
            <div className="d-flex flex-middle">
                <div className="spaces pr-5 d-flex flex-middle">
                    {(isChildren || item?.type === TYPE_CATEGORY.donVi)
                        ? <KTSVG path={"/media/icons/folder-icon.svg"} className='svg-icon-folder' />
                        : (
                            isTotal ?
                                <span className="total-number">{item?.total}</span>
                                : <KTSVG path={"/media/icons/file-icon.svg"} className='svg-icon-file' />
                        )
                    }
                </div>
                <span className={`truncate-text ${isChildren && (codeCollapses.includes(item.code)) ? "spaces fw-600" : ""}`}>
                    {item.name}
                </span>
            </div>
        </div>
    )
}

const SelectTree = (
    {
        codeCollapses,
        handleChangeCollapsesCode,
        idSelected,
        handleChangeSelectId,
        selectTree,
        className,
        handleRow,
        isTotal,
    }: TProps
) => {
    const handleCollapse = (code: string) => {
        if (codeCollapses.includes(code)) {
            handleChangeCollapsesCode(codeCollapses.filter((item: string) => item !== code));
        } else {
            handleChangeCollapsesCode([...codeCollapses, code]);
        }
    };

    return (
        <div className={`treeSelect ${className}`}>
            {(selectTree && selectTree?.length > 0) && selectTree?.map((item: any, itemIndex: number) => (
                <div key={(item?.code + itemIndex)} className="spaces ml-10">
                    <Collapse
                        item={item}
                        handleCollapse={handleCollapse}
                        codeCollapses={codeCollapses}
                        handleRow={handleRow}
                        isTotal={isTotal}
                        idSelected={idSelected}
                        handleChangeSelectId={handleChangeSelectId}
                    />

                    {codeCollapses.includes(item.code) &&
                        item?.filter?.map((i: any, index: number) => (
                            <div key={(i?.code + index)} className="spaces ml-20">
                                <Collapse
                                    item={i}
                                    handleCollapse={handleCollapse}
                                    codeCollapses={codeCollapses}
                                    handleRow={handleRow}
                                    isTotal={isTotal}
                                    idSelected={idSelected}
                                    handleChangeSelectId={handleChangeSelectId}
                                />
                            </div>
                        ))}
                </div>
            ))}
        </div>
    )
}

export default SelectTree
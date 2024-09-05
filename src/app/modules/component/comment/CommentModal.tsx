import { Col, Modal, Row } from "react-bootstrap";
import { IOderItem, IOderRes } from "../../oder-info/models/oderInfoModels";
import { filterObject, removeDuplicates } from "../../utils/FunctionUtils";
import { useEffect, useState } from "react";
import { addReview, updateReview } from "../../services";
import { IReview, initReview } from "./CommentConstants";
import { RESPONSE_STATUS_CODE } from "../../utils/Constant";
import { toast } from "react-toastify";
import { Rating } from "@mui/material";
import TextValidator from "../input-field/TextValidator";
import { IProduct } from "../../product/models/ProductModel";
import useMultiLanguage from "~/app/hook/useMultiLanguage";

interface Iprops {
    isShowModal: boolean,
    handleClose: () => void,
    dataItem: IOderRes,
    updatePageData :()=>void
}

function CommentModal(props: Iprops) {
    const { isShowModal, handleClose, dataItem, updatePageData } = props;
    const [dataReview, setDataReview] = useState<IReview[]>([])
    const { lang } = useMultiLanguage();
    const [loading, setLoading] = useState(false)
    const [isReview, setIsReview] = useState(false)
    const [formData, setFormData] = useState<IReview>(initReview)
    const handleChange = (name: string, value: any) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleUpdateReview = async () => {
        try {
            setLoading(true);
            const { data } = await updateReview({
                ...formData,
                thoiGian: new Date()
            });

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setFormData(initReview);
                handleClose();
                updatePageData();
            } else toast.warning(data.message)
            setIsReview(false);
        } catch (error) {
            console.error(lang("GENERAL.ERROR"));
        } finally {
            setLoading(false);
        }
    }

    const handleCreateReview = async () => {
        try {
            setLoading(true);
            const { data } = await addReview(filterObject({
                soSao: formData.soSao,
                noiDung: formData.noiDung,
                thoiGian: new Date(),
                maSanPham: formData?.product?.id,
                maDonHang: dataItem.id
            }));

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setFormData(initReview);
                handleClose();
                updatePageData();
            } else toast.warning(data.message)
            setIsReview(false);
        } catch (error) {
            console.error(lang("GENERAL.ERROR"));
        } finally {
            setLoading(false);
        }
    }

    const getReviewByProductId = (productId: string): IReview | undefined => {
        return dataItem.listReview.find((item: IReview) => item.maSanPham === productId);
    }

    useEffect(() => {
        if (!dataItem) return;
        const dataProduct = removeDuplicates(dataItem.listOrderDetail.map((item: IOderItem) => item.productDetail.product));
        const dataReview: IReview[] = dataProduct.map((item: IProduct) => {
            const review = getReviewByProductId(item?.id || "");
            if (review) {
                return {
                    ...review,
                    product: item
                };
            } else return {
                ...initReview,
                product: item
            }
        }) as IReview[]
        setDataReview(dataReview)
    }, [dataItem])

    return (
        <Modal
            show={isShowModal}
            centered
            aria-labelledby="example-custom-modal-styling-title"
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title
                    id="example-custom-modal-styling-title"
                    className="p-1"
                >
                    Đánh giá đơn hàng này
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {!isReview && dataReview.map((item: IReview) =>
                    <Row className="p-2">
                        <div className="col-sm-7">
                            <div className="d-flex align-items-center mb-4">
                                <div className="me-3 position-relative">
                                    <img src={item?.product?.hinhAnh} className="img-sm rounded border spaces w-80 h-80" />
                                </div>
                                <div className="col-sm-8 flex-shrink-1">
                                    <a href="#" className="nav-link">
                                        <span className="text-ellipsis" title={item?.product?.tenSanPham}>{item?.product?.tenSanPham}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-5 flex align-items-center justify-content-end ">
                            <button type="button" className="btn btn-outline-primary me-3 btn-small text-hover-white" onClick={() => { setFormData(item); setIsReview(true) }}>{item.id ? 'Sửa đánh giá' : 'Đánh giá'}<i className="ms-2 fa-solid fa-arrow-right text-primary"></i></button>
                        </div>
                    </Row>
                )}
                {loading && <p className="text-center"><span className='spinner-border spinner-border-sm align-middle ms-2'></span></p>}
                {isReview && !loading &&
                    <Row className="justify-content-center">
                        <Col sm={12}>
                            <div className="d-flex align-items-center mb-4">
                                <div className="me-3 position-relative">
                                    <img src={formData?.product?.hinhAnh} className="img-sm rounded border spaces w-80 h-80" />
                                </div>
                                <div className="col-sm-8 flex-shrink-1">
                                    <a href="#" className="nav-link">
                                        <span className="text-ellipsis" title={formData?.product?.tenSanPham}>{formData?.product?.tenSanPham}</span>
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col sm={12}>
                            <Rating name="soSao" defaultValue={formData?.soSao || 0} precision={1} onChange={(e: React.SyntheticEvent, newValue) => handleChange("soSao", newValue)} readOnly={false} />
                        </Col>
                        <Col sm={12} className="mb-2">
                            <TextValidator
                                as="textarea"
                                name="noiDung"
                                value={formData.noiDung}
                                type="text"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.name, e.target.value)}
                            />
                        </Col>
                        <Col sm={12} className="flex flex-end">
                            <button type="button" className="btn btn-outline-primary me-3" onClick={() => formData.id ? handleUpdateReview() : handleCreateReview()}>{formData.id ? 'Lưu' : 'Đánh giá'}</button>
                            <button type="button" className="btn btn-outline-dark" onClick={() => { setIsReview(false); setFormData(initReview) }}>Hủy</button>
                        </Col>
                    </Row>
                }
            </Modal.Body>
            <Modal.Footer className="flex-center p-1">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>{lang("BTN.CANCEL")}</button>
            </Modal.Footer>
        </Modal>
    )
}
export { CommentModal };
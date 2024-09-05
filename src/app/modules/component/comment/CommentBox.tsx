import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteReview, updateReview } from "../../services";
import { filterObject, formatDateParam } from "../../utils/FunctionUtils";
import { RESPONSE_STATUS_CODE } from "../../utils/Constant";
import { ICustomer } from "../../customer/models/CustomerModel";
import TextValidator from "../input-field/TextValidator";
import { UserModel } from "../../auth";
import { KTSVG } from "~/_metronic/helpers";
import { Col, Row } from "react-bootstrap";
import { IReview } from "./CommentConstants";
import useMultiLanguage from "~/app/hook/useMultiLanguage";
import { IUser } from "../../user/models/UserModel";

interface IProps {
    item: IReview,
    currentUser: IUser | undefined,
    updateDataComment: () => void
}

function CommentBox(props: IProps) {
    const { item, currentUser, updateDataComment } = props;
    const { lang } = useMultiLanguage();
    const [formData, setFormData] = useState<IReview>(item);
    const [loading, setLoading] = useState(false)
    const [isEditable, setIsEditable] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);
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
                updateDataComment();
                setIsEdit(false);
            }
        } catch (error) {
            console.error(lang("GENERAL.ERROR"));
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteReview = async (id: string) => {
        try {
            setLoading(true);
            const { data } = await deleteReview(id);

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                updateDataComment();
                setIsDelete(false);
            }
        } catch (error) {
            console.error(lang("GENERAL.ERROR"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        item && setFormData(item);
    }, [item])

    useEffect(() => {
        setIsEditable(item.customer.id === currentUser?.maKhachHang);
    }, [item.customer.id, currentUser?.maKhachHang])

    return (
        <div className="d-flex flex-start mb-4">
            <img className="rounded-circle shadow-1-strong me-3 flex-shrink-0"
                src={item?.customer?.anhDaiDien} alt="avatar" width="65"
                height="65" />
            <div className="card w-100">
                <div className="card-body p-4">
                    <div className="flex justify-content-between">
                        <h5>{item?.customer?.tenKhachHang}</h5>
                        {!isEdit && !isDelete&& <Rating name="soSao" value={item?.soSao || 0} precision={0.5} readOnly />}
                    </div>
                    <small>
                      <i className="fa fa-calendar-alt fa-sm spaces mr-4"></i>
                      {formatDateParam(item?.thoiGian)}
                    </small>
                    <p className="flex align-items-center">
                        {!isEdit && !isDelete && item?.noiDung}
                        {isEditable && !isEdit && !isDelete &&
                            <div className="ms-3 flex">
                                <button onClick={() => setIsEdit(true)} className="btn-action" title="Sửa đánh giá">
                                    <KTSVG path="/media/icons/pen.svg" />
                                </button>
                                <button className="btn-action" title="Xóa đánh giá" onClick={() => setIsDelete(true)}>
                                    <KTSVG path="/media/icons/trash-can.svg" />
                                </button>
                            </div>
                        }
                    </p>
                    {loading && <p className="text-center"><span className='spinner-border spinner-border-sm align-middle ms-2'></span></p>}
                    {isEdit && !loading &&
                        <Row>
                            <Col sm={12}>
                                <Rating name="soSao" value={item?.soSao || 0} precision={1} onChange={(e: React.SyntheticEvent, newValue) => handleChange("soSao", newValue)} readOnly={false} />
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
                                <button type="button" className="btn btn-outline-primary me-3" onClick={() => handleUpdateReview()}>Đánh giá</button>
                                <button type="button" className="btn btn-outline-dark" onClick={() => setIsEdit(false)}>Hủy</button>
                            </Col>
                        </Row>
                    }
                    {isDelete && !loading &&
                        <Row>
                            <h5>Bạn có chắc muốn xóa bình luận này ?</h5>
                            <hr></hr>
                            <Col sm={12} className="flex flex-end">
                                <button type="button" className="btn btn-outline-primary me-3" onClick={() => handleDeleteReview(formData.id)}>Xác nhận</button>
                                <button type="button" className="btn btn-outline-dark" onClick={() => setIsDelete(false)}>Hủy</button>
                            </Col>
                        </Row>
                    }
                </div>
            </div>
        </div>
    )
}

export { CommentBox };
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { addReview, getReview } from "../../services";
import { filterObject } from "../../utils/FunctionUtils";
import { RESPONSE_STATUS_CODE } from "../../utils/Constant";
import { ICustomer } from "../../customer/models/CustomerModel";
import TextValidator from "../input-field/TextValidator";
import { CommentBox } from "./CommentBox";
import { useAuth } from "../../auth";
import { KTSVG } from "~/_metronic/helpers";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { IReview, initReview } from "./CommentConstants";
import useMultiLanguage from "~/app/hook/useMultiLanguage";

interface IProps {
    maSanPham?: string;
    isReviewAble?: boolean;
}

function Comment(props: IProps) {
    const { maSanPham, isReviewAble } = props;
    const { lang } = useMultiLanguage();
    const { currentUser } = useAuth();
    const [data, setData] = useState<IReview[]>([]);
    const [formData, setFormData] = useState<IReview>(initReview);
    const [loading, setLoading] = useState(false)
    const [totalPage, setTotalPage] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [numberOfElements, setNumberOfElements] = useState<number>(0);
    const [isAdding, setIsAdding] = useState<boolean>(!!isReviewAble);
    const [searchObject, setSearchObject] = useState<any>({
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
        maSanPham: maSanPham
    });

    const handleChange = (name: string, value: any) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleCreateReview = async () => {
        try {
            setLoading(true);
            const { data } = await addReview(filterObject({
                soSao: formData.soSao,
                noiDung: formData.noiDung,
                thoiGian: new Date(),
                maSanPham: maSanPham
            }));

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                handleSearch();
                setFormData(initReview);
            } else toast.warning(data.message)
            setIsAdding(false);
        } catch (error) {
            console.error(lang("GENERAL.ERROR"));
        } finally {
            setLoading(false);
        }

    }

    const updatePageData = async (searchObject: any = {}) => {
        try {
            setLoading(true);
            const { data } = await getReview(filterObject(searchObject));
            setTotalPage(data?.data?.totalPages);
            setTotalElements(data?.data?.totalElements);
            setNumberOfElements(data?.data?.numberOfElements);

            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setData(data?.data?.content);
            }
        } catch (error) {
            console.error(lang("GENERAL.ERROR"));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const searchData = {
            ...searchObject,
            maSanPham: maSanPham
        }
        setSearchObject(searchData)
        updatePageData(searchData);
    }

    useEffect(() => {
        if (!maSanPham) return;
        handleSearch();
    }, [maSanPham])

    return (
        <section>
            <div className="container my-5 py-5 text-dark">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-11">
                        {loading && <p className="text-center"><span className='spinner-border spinner-border-sm align-middle ms-2'></span></p>}
                        {isAdding && !loading &&
                            <Row className="justify-content-center">
                                <Col sm={12}>
                                    <Rating name="soSao" value={formData?.soSao || 0} precision={1} onChange={(e: React.SyntheticEvent, newValue) => handleChange("soSao", newValue)} readOnly={false} />
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
                                    <button type="button" className="btn btn-outline-primary me-3" onClick={() => handleCreateReview()}>Đánh giá</button>
                                    <button type="button" className="btn btn-outline-dark" onClick={() => setIsAdding(false)}>Hủy</button>
                                </Col>
                                <hr className="my-16 px-16 spaces width-95"></hr>
                            </Row>
                        }
                        {data.length > 0 ? data.map((item: IReview) =>
                            <CommentBox item={item} currentUser={currentUser} updateDataComment={handleSearch} />
                        ) :
                            <div className="text-muted text-center">Sản phẩm chưa có đánh giá nào</div>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export { Comment };
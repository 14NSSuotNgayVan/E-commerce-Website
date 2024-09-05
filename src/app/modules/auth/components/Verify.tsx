import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { statusTheme } from "../../constant";
import { verifyEmail } from "../core/_requests";
import jwt_decode from "jwt-decode";
import { setSubMenu, useAuth } from "..";
import { RESPONSE_STATUS_CODE } from "../../utils/Constant";
import AppContext from "~/app/AppContext";
import { headerConstant } from "~/_metronic/layout/components/header/header-menus/constant";
import { IUser } from "../../user/models/UserModel";

function Verify() {
    const [message, setMessage] = useState<string>('');
    const { setPageLoading } = useContext(AppContext);
    const [loading, setLoading] = useState(false)
    const [statusType, setStatusType] = useState<string>(statusTheme.warning);
    const { token } = useParams();
    const [isVerified, setIsverified] = useState<boolean>(false)
    const { saveAuth, setCurrentUser } = useAuth()
    
    const getToken = async () => {
        setLoading(true)
        try {
            const { data } = await verifyEmail(token || "")
            if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
                setMessage(data.message)
                setStatusType(statusTheme.success)
                if (data?.data?.access_token) {
                    saveAuth(data.data)
                    const userToken = jwt_decode(data.data.access_token) as {
                        user: IUser;
                        authorities: string[]
                    }

                    if (userToken?.user.role) {
                        localStorage.setItem(headerConstant.USER_ROLE, JSON.stringify(userToken?.user.role));
                    }
                    if (userToken?.authorities) {
                        const permissionObj: { [key: string]: boolean; } = {};
                        for (const permission of userToken.authorities) {
                            permissionObj[permission] = true;
                        }
                        localStorage.setItem(headerConstant.AUTHORITIES, JSON.stringify(permissionObj));
                    }
                    setSubMenu()
                    setCurrentUser(userToken.user)
                }
            } else {
                setMessage(data.message)
                setStatusType(statusTheme.warning)
            }
        } catch (error) {
            console.error(error)
            setMessage('Có lỗi sảy ra, vui lòng thử lại sau')
            setStatusType(statusTheme.danger)
        }
        setLoading(false)
    }

    useEffect(() => {
        getToken();
    }, [])

    return (
        <div className="card spaces w-400">
            <div className={`card-header justify-content-center align-items-center spaces h-50`}>
                <h3>Xác thực người dùng</h3>
            </div>
            <div className="card-body">
                {message && <div className={`spaces mb-8 alert alert-${statusType}`}>
                    <div className='alert-text font-weight-bold'>{message}</div>
                </div>}
                <div className="flex flex-center justify-content-center">
                    {loading && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                            Đang xác thực, vui lòng chờ...{' '}
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
export { Verify }
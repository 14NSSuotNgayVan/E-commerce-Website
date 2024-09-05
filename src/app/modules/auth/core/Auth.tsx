import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import { AuthModel } from './_models'
import * as authHelper from './AuthHelpers'
import { getUserByToken } from './_requests'
import { WithChildren } from '../../../../_metronic/helpers'
import { toast } from "react-toastify";
import { RESPONSE_STATUS_CODE } from '~/app/constants/Status'
import { LOCAL_STORAGE_KEY, ROLE } from '~/app/constants/Common'
import { useNavigate } from 'react-router-dom'
import { hasRole } from '../../utils/FunctionUtils'
import { IUser } from '../../user/models/UserModel'
import { localStorageItem } from '../../utils/LocalStorage'
import { headerConstant } from '~/_metronic/layout/components/header/header-menus/constant'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser?: IUser
  setCurrentUser: Dispatch<SetStateAction<IUser | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => { },
  currentUser: undefined,
  setCurrentUser: () => { },
  logout: () => { },
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<IUser | undefined>()

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, logout, setCurrentUser } = useAuth()
  const didRequest = useRef(false)
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const navigate = useNavigate();

  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async (accessToken: string) => {
      try {
        if (!didRequest.current) {
          const { data } = await getUserByToken(accessToken)

          if (data.code === RESPONSE_STATUS_CODE.SUCCESS && data.data) {
            setCurrentUser(data.data.user)
          }
        }
      } catch (error: any) {
        if (!didRequest.current) {
          if (error?.response?.status === RESPONSE_STATUS_CODE.UNAUTHORIZED) {
            toast.error("Đã hết phiên đăng nhập, vui lòng dăng nhập lại!");
              logout();
              navigate('/home');
        }
      }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (auth && auth.access_token) {
      requestUser(auth.access_token)
    } else {
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, AuthInit, useAuth }

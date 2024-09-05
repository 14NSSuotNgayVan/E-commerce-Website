import { AuthModel, ResponseModel } from './_models'
import { AxiosResponse, AxiosError, AxiosStatic, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { headerConstant } from '../../../../_metronic/layout/components/header/header-menus/constant';
import { checkMenuByPermissions, hasRole } from '../../utils/FunctionUtils';
import { localStorageItem } from '../../utils/LocalStorage';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';
import { RESPONSE_STATUS_CODE } from '~/app/constants/Status';
import { LOCAL_STORAGE_KEY, ROLE } from '~/app/constants/Common';

const AUTH_LOCAL_STORAGE_KEY = 'kt-auth-react-v'

const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY)
  if (!lsValue) {
    return
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel
    if (auth && auth.expires_date_out && (auth.expires_date_out < (new Date()).getTime())) return undefined;

    return auth
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
  }
}

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return
  }
  try {
    const newDate = new Date();
    auth.expires_date_out = newDate.setSeconds(newDate.getSeconds() + auth.expires_in);
    const lsValue = JSON.stringify(auth);
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE SAVE ERROR', error)
  }
}
const setSubMenu = () => {
  const checkedMenu = checkMenuByPermissions();
  if (localStorageItem.get(headerConstant.AUTHORITIES)) {
    const selectSubMenu = JSON.stringify(checkedMenu?.filter(menu => menu?.name === headerConstant.DEFAULT_MODULE)[0]?.subMenu || []);
    localStorage.setItem(headerConstant.LIST_SUB_MENU, selectSubMenu);
  }
}

const removeAuth = () => {
  try {
    localStorageItem.remove(AUTH_LOCAL_STORAGE_KEY)
    localStorageItem.remove(headerConstant.LIST_SUB_MENU)
    localStorageItem.remove(headerConstant.AUTHORITIES)
    localStorage.removeItem(headerConstant.USER_ROLE)
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error)
  }
}

const handleRequest = (requestConfig: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> => {
  const { headers = { Authorization: "" } } = requestConfig

  const auth = getAuth();
  if (auth && auth.access_token) {
    headers.Authorization = `Bearer ${auth.access_token}`
  }

  return requestConfig
}

const handleResponse = (responseConfig: AxiosResponse<ResponseModel>) => {
  const { data } = responseConfig

  switch (data.code) {
    case RESPONSE_STATUS_CODE.SUCCESS:
      break
    case RESPONSE_STATUS_CODE.CREATED:
    case RESPONSE_STATUS_CODE.NO_CONTENT:
      toast.success(data.message)
      break
    default:
      break
  }

  return responseConfig
}

const handleError = (error: AxiosError<ResponseModel>): Promise<AxiosError<ResponseModel>> => {
  const { isAxiosError, response } = error

  if (isAxiosError) {
    switch (response?.status) {
      case RESPONSE_STATUS_CODE.UNAUTHORIZED:
        // eslint-disable-next-line no-case-declarations
        const UserRole = localStorageItem.get(headerConstant.USER_ROLE);
        if (UserRole && [ROLE.USER].includes(UserRole)) {
          window.location.href = toAbsoluteUrl("/home");
        } else {
          window.location.href = toAbsoluteUrl("/auth");
        }
        removeAuth();
        break
      case RESPONSE_STATUS_CODE.BAD_REQUEST:
      case RESPONSE_STATUS_CODE.FORBIDDEN:
      case RESPONSE_STATUS_CODE.NOT_FOUND:
      case RESPONSE_STATUS_CODE.METHOD_NOT_ALLOWED:
      case RESPONSE_STATUS_CODE.CONFLICT:
      case RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR:
      case RESPONSE_STATUS_CODE.BAD_GATEWAY:
        toast.error(response.data.message)
        break
      default:
        break
    }
  }

  return Promise.reject(error)
}

export function setupAxios(axios: AxiosStatic) {
  axios.defaults.timeout = 15000
  axios.defaults.headers.common = {
    Accept: 'application/json',
  }
  axios.interceptors.request.use(handleRequest, handleError)
  axios.interceptors.response.use(handleResponse, handleError)
}

export { getAuth, setAuth, removeAuth, setSubMenu, AUTH_LOCAL_STORAGE_KEY }
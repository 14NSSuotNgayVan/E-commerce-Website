import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { login } from '../core/_requests'
import jwt_decode from "jwt-decode";
import { useAuth } from '../core/Auth'
import "../authLayout.scss"
import { Form } from 'react-bootstrap'
import useMultiLanguage from '../../../hook/useMultiLanguage'
import { setSubMenu } from '../core/AuthHelpers'
import { RESPONSE_STATUS_CODE, TYPE } from '../../utils/Constant'
import { toast } from "react-toastify";
import { Link } from 'react-router-dom'
import { LOCAL_STORAGE_KEY } from '~/app/constants/Common'
import { headerConstant } from '~/_metronic/layout/components/header/header-menus/constant'
import { IUser } from '../../user/models/UserModel'

export function Login() {
  const { lang } = useMultiLanguage();
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()
  const [loginUser, setLoginUser] = useState<{ username: string, password: string; }>({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false);
  const inputType = !showPassword ? TYPE.PASSWORD : TYPE.TEXT;

  const loginSchema = Yup.object().shape({
    username: Yup.string()
      .required('Tên đăng nhập là bắt buộc'),
    password: Yup.string()
      .required('Mật khẩu là bắt buộc'),
  })

  const formik = useFormik({
    initialValues: loginUser,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data } = await login(values.username, values.password)
        if (data.code === RESPONSE_STATUS_CODE.SUCCESS) {
          if(!data.data.access_token) {
            setStatus('Vui lòng xác thực tài khoản trước khi đăng nhập!')
            return;
          }
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
        } else {
          setStatus('Tài khoản hoặc mật khẩu không chính xác, vui lòng nhập lại')
        }
      } catch (error) {
        console.error(error)
        toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
        saveAuth(undefined)
        setSubmitting(false)
      }
      setLoading(false)
    },
  })

  const handleInputChange = (fieldName: string, value: string) => {
    formik.setFieldValue(fieldName, value);
    setLoginUser((prevLoginUser) => ({
      ...prevLoginUser,
      [fieldName]: value,
    }));
  };

  return (
    <div className='form-width'>
      <Form
        className='form w-100 login-form'
        onSubmit={formik.handleSubmit}
        noValidate
        id='kt_login_signin_form'
      >
        <div className='text-center'>
          <h1 className='text-black fw-bolder login-header'>{lang("AUTH.LOGIN.BUTTON")}</h1>
        </div>
        {formik.status && (
          <div className='alert alert-danger'>
            <div className='alert-text font-weight-bold'>{formik.status}</div>
          </div>
        )}
        <div className='input-wrapper spaces mb-16'>
          <span className='text-lable-input lable mb-1'>{lang("AUTH.LOGIN.USERNAME_EMAIL")}</span>
          <input
            {...formik.getFieldProps('username')}
            className={clsx(
              'form-control bg-input-login',
              {
                'is-invalid': formik.touched.username && formik.errors.username,
              },
              {
                'is-valid': formik.touched.username && !formik.errors.username,
              }
            )}
            value={loginUser.username}
            type='email'
            name='email'
            placeholder={lang("AUTH.LOGIN.USERNAME_EMAIL")}
            autoComplete='off'
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
          {formik.touched.username && formik.errors.username && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert warn-text'>{formik.errors.username}</span>
              </div>
            </div>
          )}
        </div>
        <div className='input-wrapper'>
          <div className="relative">
            <div className='mb-1 flex flex-space-between'>
              <span className='text-lable-input lable'>{lang("AUTH.INPUT.PASSWORD")}</span>
              {/* <Link to={"/auth/forgot-password"} className='text-primary forgot-password spaces fw-bold fs-14'>
                Quên mật khẩu?
              </Link> */}
            </div>
            <div className='relative'>
              <input
                type={inputType}
                autoComplete='off'
                {...formik.getFieldProps('password')}
                placeholder={lang("AUTH.INPUT.PASSWORD")}
                className={clsx(
                  'form-control bg-input-login',
                  {
                    'is-invalid': formik.touched.password && formik.errors.password,
                  },
                  {
                    'is-valid': formik.touched.password && !formik.errors.password,
                  }
                )}
                value={loginUser.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <div
                className="searchTextField icon-eye custom-icon-password border-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} ></i>
              </div>
            </div>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert warn-text'>{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>
        <div className='gap-3 fs-base fw-semibold switch-wrapper'>
          <Form.Check
            type='switch'
            id='custom-switch'
            label={<div className='text-black'>Tự động đăng nhập lần sau</div>}
          />
        </div>
        <div className='flex flex-middle flex-center align-center'>
          {/* <Link to='/auth/forgot-password' className='text-light forgot-password'>
          Quên mật khẩu ?
        </Link> */}
          <button
            type='submit'
            id='kt_sign_in_submit'
            className='button-primary login-submit'
          >
            {!loading && <span className='indicator-label'>{lang("AUTH.LOGIN.BUTTON")}</span>}
            {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
                Vui lòng chờ một lát...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        <div className='flex flex-end'>
          <Link to={"/auth/registration"} className='text-primary forgot-password spaces fs-14 text-underline'>
            Đăng ký tài khoản
          </Link>
        </div>
      </Form>
    </div>
  )
}

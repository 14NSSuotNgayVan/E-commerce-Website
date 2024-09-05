import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { getUserByToken, register } from '../core/_requests'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { PasswordMeterComponent } from '../../../../_metronic/assets/ts/components'
import { useAuth } from '../core/Auth'
import TextValidator from '../../component/input-field/TextValidator'
import { REGEX, RESPONSE_STATUS_CODE } from '../../utils/Constant'
import { statusTheme } from '../../constant'

const initialValues = {
  tenKhachHang: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  tenKhachHang: Yup.string()
    .min(3, 'Tối thiểu 3 ký tự')
    .max(50, 'Tối đa 50 ký tự')
    .matches(REGEX.LETTER_ONLY, 'Tên chỉ chứa chữ hoặc dấu cách')
    .required('Họ tên là bắt buộc'),
  email: Yup.string()
    .email('Emai không đúng định dạng')
    .min(3, 'Tối thiểu 3 ký tự')
    .max(50, 'Tối đa 50 ký tự')
    .required('Email là bắt buộc'),
  username: Yup.string()
    .min(3, 'Tối thiểu 3 ký tự')
    .max(50, 'Tối đa 50 ký tự')
    .matches(REGEX.LETTER_OR_NUMBER_ONLY, "Tên đăng nhập chỉ chứa chữ hoặc số")
    .required('Tên đăng nhập là bắt buộc'),
  password: Yup.string()
    .min(8, 'Tối thiểu 8 kí tự')
    .max(16, 'Tối đa 16 kí tự')
    .matches(REGEX.USER_PASSWORD, "mật khẩu không đúng định dạng")
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Mật khẩu nhập lại không trùng khớp")
    .required('Vui lòng nhập lại mật khẩu'),
  acceptTerms: Yup.bool().required('Vui lòng chấp nhận điều khoản và dịch vụ'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()
  const [statusType, setStatusType] = useState<string>(statusTheme.warning);

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data } = await register(
          values.tenKhachHang,
          values.username,
          values.email,
          values.password,
        )

        if (data?.code === RESPONSE_STATUS_CODE.SUCCESS) {
          if (data?.data.verified === false) {
            setStatus("Đăng ký thành công, thông tin xác thực đã được gửi tới email của bạn")
            setStatusType(statusTheme.success)
          }
        } else setStatus(data.message)

      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('Đăng ký không thành công')
        setStatusType(statusTheme.danger)
        setSubmitting(false)
      }
      setLoading(false)
    },
  })

  useEffect(() => {
    PasswordMeterComponent.bootstrap()
  }, [])

  return (
    <div className='form-width'>
      <form
        className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework registration-form bg-white'
        noValidate
        id='kt_login_signup_form'
        onSubmit={formik.handleSubmit}
      >
        {/* begin::Heading */}
        <div className='text-center mb-2'>
          {/* begin::Title */}
          <h1 className='text-dark fw-bolder mb-3'>Đăng ký</h1>
          {/* end::Title */}
        </div>

        {formik.status && (
          <div className={`spaces mb-8 alert alert-${statusType}`}>
            <div className='alert-text font-weight-bold'>{formik.status}</div>
          </div>
        )}

        {/* begin::Form group name */}
        <div className='fv-row mb-3'>
          <label className='form-label fw-bolder text-dark fs-6'>Họ Tên</label>
          <TextValidator
            placeholder='Họ tên'
            type='text'
            name="tenKhachHang"
            value={formik.values.tenKhachHang}
            onChange={formik.handleChange}
            touched={formik.touched.tenKhachHang}
            errors={formik.errors.tenKhachHang}
            onBlur={formik.handleBlur}
          />
        </div>
        {/* end::Form group */}
        <div className='fv-row mb-3'>
          {/* begin::Form group username */}
          <label className='form-label fw-bolder text-dark fs-6'>Tên tài khoản</label>
          <TextValidator
            placeholder='Tên tài khoản'
            type='text'
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            touched={formik.touched.username}
            errors={formik.errors.username}
            onBlur={formik.handleBlur}
          />
        </div>

        {/* begin::Form group Email */}
        <div className='fv-row mb-3'>
          <label className='form-label fw-bolder text-dark fs-6'>Email</label>
          <TextValidator
            placeholder='Email'
            type='text'
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            touched={formik.touched.email}
            errors={formik.errors.email}
            onBlur={formik.handleBlur}
          />
        </div>
        {/* end::Form group */}

        {/* begin::Form group Password */}
        <div className='fv-row mb-3' data-kt-password-meter='true'>
          <div className='mb-1'>
            <label className='form-label fw-bolder text-dark fs-6'>Mật khẩu</label>
            <div className='relative mb-3'>
              <TextValidator
                placeholder='Mật khẩu'
                type='password'
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                touched={formik.touched.password}
                errors={formik.errors.password}
                onBlur={formik.handleBlur}
              />
            </div>
            {/* begin::Meter */}
            <div
              className='d-flex align-items-center mb-3'
              data-kt-password-meter-control='highlight'
            >
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2'></div>
              <div className='flex-grow-1 bg-secondary bg-active-success rounded h-5px'></div>
            </div>
            {/* end::Meter */}
          </div>
          <div className='text-muted'>
            Sử dụng 8 ký tự trở lên với sự kết hợp của các chữ cái in hoa in thường, số và ký hiệu.
          </div>
        </div>
        {/* end::Form group */}

        {/* begin::Form group Confirm password */}
        <div className='fv-row mb-5'>
          <label className='form-label fw-bolder text-dark fs-6'>Nhập lại mật khẩu</label>
          <TextValidator
            placeholder='Nhập lại mật khẩu'
            type='password'
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            touched={formik.touched.confirmPassword}
            errors={formik.errors.confirmPassword}
            onBlur={formik.handleBlur}
          />
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='fv-row mb-3'>
          <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
            <input
              className='form-check-input'
              type='checkbox'
              id='kt_login_toc_agree'
              {...formik.getFieldProps('acceptTerms')}
            />
            <span>
              Tôi chấp nhận{' '}
              <a
                href=''
                target='_blank'
                className='ms-1 link-primary'
              >
                Điều khoản
              </a>
              .
            </span>
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='text-center'>
          <button
            type='submit'
            id='kt_sign_up_submit'
            className='btn btn-lg btn-primary w-100 mb-5'
            disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms || loading}
          >
            {!loading && <span className='indicator-label'>Gửi</span>}
            {loading && (
              <span className='indicator-progress' style={{ display: 'block' }}>
                Vui lòng chờ...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
          <Link to='/auth'>
            <button
              type='button'
              id='kt_login_signup_form_cancel_button'
              className='btn btn-lg btn-light-primary w-100 mb-5'
            >
              Hủy
            </button>
          </Link>
          <div className='flex flex-end spaces fs-15'> Bạn đã có tài khoản?
            <Link to={"/auth/login"} className='text-primary forgot-password spaces text-underline ml-4'>
              Đăng nhập
            </Link>
          </div>
        </div>
        {/* end::Form group */}
      </form>
    </div>
  )
}

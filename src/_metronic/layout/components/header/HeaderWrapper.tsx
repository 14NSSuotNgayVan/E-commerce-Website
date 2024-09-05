import clsx from 'clsx'
import { KTSVG } from '../../../helpers'
import { useLayout } from '../../core'
import { Header } from './Header'
import { hasRole } from '../../../../app/modules/utils/FunctionUtils'
import { ROLE } from '../../../../app/constants/Common'
import { useAuth } from '~/app/modules/auth'
import { Navbar } from './Navbar'


export function HeaderWrapper() {
  const { config, classes } = useLayout()
  const { currentUser } = useAuth();


  if (!config.app?.header?.display) {
    return null
  }

  return (
    <div id='kt_app_header' className='app-header spaces px-16'>
      <div
        id='kt_app_header_container'
        className={clsx(
          'flex-grow-1',
          classes.headerContainer.join(' '),
          config.app?.header?.default?.containerClass
        )}
      >
        {config.app.sidebar?.display && hasRole([ROLE.ADMIN, ROLE.MANAGER,ROLE.ROLE_SUPPER_ADMIN]) &&
          <>
            <div
              className='d-flex align-items-center d-lg-none ms-n2 me-2'
              title='Show sidebar menu'
            >
              <div
                className='btn btn-icon btn-primary spaces ml-20 mr-10 cursor-pointer p-8'
                id='kt_app_sidebar_mobile_toggle'
              >
                <KTSVG path='/media/icons/list.svg' svgClassName='spaces w-24 h-24' />
              </div>
            </div>
          </>
        }
        <div
          id='kt_app_header_wrapper'
          className='d-flex justify-content-between flex-grow-1 '
        >
          {config.app.header.default?.content === 'menu' &&
            config.app.header.default.menu?.display && (
              <div
                className='app-header-menu app-header-mobile-drawer align-items-stretch'
                data-kt-drawer='true'
                data-kt-drawer-name='app-header-menu'
                data-kt-drawer-activate='{default: true, lg: false}'
                data-kt-drawer-overlay='true'
                data-kt-drawer-width='180px'
                data-kt-drawer-direction='end'
                data-kt-drawer-toggle='#kt_app_header_menu_toggle'
                data-kt-swapper='true'
                data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
              >
                <Header />
              </div>
            )}
          <Navbar />
        </div>
      </div>
    </div>
  )
}

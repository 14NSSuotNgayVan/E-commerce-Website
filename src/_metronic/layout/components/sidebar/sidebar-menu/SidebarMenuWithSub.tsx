import React from 'react'
import clsx from 'clsx'
import {useLocation} from 'react-router'
import {checkIsActive, KTSVG, WithChildren} from '../../../../helpers'
import {useLayout} from '../../../core'
import { TSubMenu } from '../../../../../app/pages/Homepage/listMenu'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  subMenu: TSubMenu[]
}

const SidebarMenuWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  subMenu
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {app} = config;

  return (
    <div
      className={clsx('menu-item menu-accordion', {'here show': isActive})}
      data-kt-menu-trigger='click'
    >
      <span className='menu-link parent'>
        {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
          <span className='menu-icon parent'>
            <KTSVG path={icon} className='svg-icon-2' />
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
          <i className={clsx('bi fs-3', fontIcon)}></i>
        )}
        <span className='menu-title'>{title}</span>
        {subMenu?.length > 0 && (
          <span className='menu-arrow'></span>
        )}
      </span>
      <div className={clsx('menu-sub menu-sub-accordion mb-2', {'menu-active-bg': isActive})}>
        {children}
      </div>
    </div>
  )
}

export {SidebarMenuWithSub}

import {FC} from 'react'
import {useLocation} from 'react-router'
import {Link} from 'react-router-dom'
import clsx from 'clsx'
import {checkIsActive, KTSVG} from '../../../../helpers'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasArrow?: boolean
  hasBullet?: boolean
  onClick?: () => void
  iconClass?: string
}

const MenuItem: FC<Props> = ({to, title, icon, fontIcon, hasArrow = false, hasBullet = false, onClick, iconClass}) => {
  const {pathname} = useLocation()

  return (
    <div className='menu-item' onClick={onClick}>
      <Link
        className={clsx('menu-link', {
          'active menu-here': checkIsActive(pathname, to),
        })}
        to={to}
      >
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}

        {icon && (
          <span className='menu-icon'>
            <KTSVG path={icon} className={`svg-icon-2 ${iconClass}`} />
          </span>
        )}

        {fontIcon && (
          <span className='menu-icon'>
            <i className={clsx('bi fs-3', fontIcon)}></i>
          </span>
        )}

        <span className='menu-title'>{title}</span>

        {hasArrow && <span className='menu-arrow'></span>}
      </Link>
    </div>
  )
}

export {MenuItem}

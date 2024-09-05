import { FC, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import clsx from 'clsx';
import { checkIsActive, KTSVG, WithChildren } from '../../../../helpers';

type Props = {
  to: string;
  title?: string;
  icon?: string;
  fontIcon?: string;
  menuTrigger?: 'click' | `{default:'click', lg: 'hover'}`;
  menuPlacement?: 'right-start' | 'bottom-start' | 'left-start';
  hasArrow?: boolean;
  hasBullet?: boolean;
  isMega?: boolean;
  freeSize?: boolean;
  iconClass?: string;
};

const MenuInnerWithSub: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  menuTrigger,
  menuPlacement,
  hasArrow = false,
  hasBullet = false,
  isMega = false,
  freeSize = false,
  iconClass
}) => {
  const menuItemRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (menuItemRef.current && menuTrigger && menuPlacement) {
      menuItemRef.current.setAttribute('data-kt-menu-trigger', menuTrigger);
      menuItemRef.current.setAttribute('data-kt-menu-placement', menuPlacement);
    }
  }, [menuTrigger, menuPlacement]);

  return (
    <div ref={menuItemRef} className='menu-item menu-lg-down-accordion'>
      <span
        className={clsx('menu-link p-0', {
          active: checkIsActive(pathname, to),
        })}
      >
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}

        {icon && (
          <span className='menu-icon'>
            <KTSVG path={icon} className={`svg-icon-2 ${iconClass}`}/>
          </span>
        )}

        {fontIcon && (
          <span className='menu-icon'>
            <i className={clsx('bi fs-2', fontIcon)}></i>
          </span>
        )}
        {
          title && (
            <span className='menu-title'>{title}</span>
          )
        }

        {hasArrow && <span className='menu-arrow'></span>}
      </span>
      <div
        className={clsx(
          'menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown',
          isMega ? 'w-100 w-lg-850px p-5 p-lg-5' : freeSize ? 'menu-rounded-0 py-lg-1 ps-1' : 'menu-rounded-0 py-lg-4 w-lg-225px'
        )}
        data-kt-menu-dismiss='true'
      >
        {children}
      </div>
    </div>
  );
};

export { MenuInnerWithSub };

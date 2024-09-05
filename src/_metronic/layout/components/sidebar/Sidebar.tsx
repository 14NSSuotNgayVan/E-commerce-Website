import clsx from 'clsx'
import { useCallback, useContext, useEffect } from 'react'
import { ILayout, useLayout } from '../../core'
import { SidebarMenu } from './sidebar-menu/SidebarMenu'
import { KTSVG } from '../../../helpers'
import { SidebarContext } from './SidebarContext'
import { DrawerComponent, ToggleComponent } from '../../../assets/ts/components'

const Sidebar = () => {
  const { config } = useLayout()
  const { setIsToggleOn } = useContext(SidebarContext)

  const handleToggleClick = useCallback(() => {
    const isMinimized = document.body.getAttribute('data-kt-app-sidebar-minimize') === 'on';
    setIsToggleOn && setIsToggleOn(!isMinimized);
  }, [setIsToggleOn]);

  useEffect(() => {
    updateDOM(config)
    handleToggleClick()

    const timeOut = setTimeout(() => {
      ToggleComponent.reInitialization();
      DrawerComponent.reInitialization();
    }, 70);

    return () => clearTimeout(timeOut);
  }, [config, handleToggleClick])

  if (!config.app?.sidebar?.display) {
    return null
  }

  const appSidebarDefaultMinimizeDesktopEnabled =
    config?.app?.sidebar?.default?.minimize?.desktop?.enabled
  const appSidebarDefaultCollapseDesktopEnabled =
    config?.app?.sidebar?.default?.collapse?.desktop?.enabled
  const toggleType = appSidebarDefaultCollapseDesktopEnabled
    ? 'collapse'
    : appSidebarDefaultMinimizeDesktopEnabled
      ? 'minimize'
      : ''
  const toggleState = appSidebarDefaultMinimizeDesktopEnabled ? 'active' : '';
  const appSidebarDefaultMinimizeDefault = config.app?.sidebar?.default?.minimize?.desktop?.default

  return (
    <div id='kt_app_sidebar' className={clsx('app-sidebar', config.app?.sidebar?.default?.class)}>
      {(appSidebarDefaultMinimizeDesktopEnabled || appSidebarDefaultCollapseDesktopEnabled) && (
        <div
          id='kt_app_sidebar_toggle'
          className={clsx(
            'app-sidebar-toggle btn-icon btn-shadow btn-color-muted btn-active-color-primary body-bg position-absolute top-50 start-100 rotate',
            { active: appSidebarDefaultMinimizeDefault }
          )}
          data-kt-toggle='true'
          data-kt-toggle-state={toggleState}
          data-kt-toggle-target='body'
          data-kt-toggle-name={`app-sidebar-${toggleType}`}
          onClick={handleToggleClick}
        >
          <KTSVG path='/media/icons/arrow-left.svg' className="rotate-180 text-white" svgClassName={`position-absolute translate-middle`} />
        </div>
      )}
      <SidebarMenu />
    </div>
  )
}

const updateDOM = (config: ILayout) => {
  if (config.app?.sidebar?.default?.minimize?.desktop?.enabled) {
    if (config.app?.sidebar?.default?.minimize?.desktop?.default) {
      document.body.setAttribute('data-kt-app-sidebar-minimize', 'on')
    }

    if (config.app?.sidebar?.default?.minimize?.desktop?.hoverable) {
      document.body.setAttribute('data-kt-app-sidebar-hoverable', 'true')
    }
  }

  if (config.app?.sidebar?.default?.minimize?.mobile?.enabled) {
    if (config.app?.sidebar?.default?.minimize?.mobile?.default) {
      document.body.setAttribute('data-kt-app-sidebar-minimize-mobile', 'on')
    }

    if (config.app?.sidebar?.default?.minimize?.mobile?.hoverable) {
      document.body.setAttribute('data-kt-app-sidebar-hoverable-mobile', 'true')
    }
  }

  if (config.app?.sidebar?.default?.collapse?.desktop?.enabled) {
    if (config.app?.sidebar?.default?.collapse?.desktop?.default) {
      document.body.setAttribute('data-kt-app-sidebar-collapse', 'on')
    }
  }

  if (config.app?.sidebar?.default?.collapse?.mobile?.enabled) {
    if (config.app?.sidebar?.default?.collapse?.mobile?.default) {
      document.body.setAttribute('data-kt-app-sidebar-collapse-mobile', 'on')
    }
  }

  if (config.app?.sidebar?.default?.push) {
    if (config.app?.sidebar?.default?.push?.header) {
      document.body.setAttribute('data-kt-app-sidebar-push-header', 'true')
    }

    if (config.app?.sidebar?.default?.push?.toolbar) {
      document.body.setAttribute('data-kt-app-sidebar-push-toolbar', 'true')
    }

    if (config.app?.sidebar?.default?.push?.footer) {
      document.body.setAttribute('data-kt-app-sidebar-push-footer', 'true')
    }
  }

  if (config.app?.sidebar?.default?.stacked) {
    document.body.setAttribute('app-sidebar-stacked', 'true')
  }

  document.body.setAttribute('data-kt-app-sidebar-enabled', 'true')
  document.body.setAttribute(
    'data-kt-app-sidebar-fixed',
    config.app?.sidebar?.default?.fixed?.desktop?.toString() || ''
  )

  const appSidebarDefaultDrawerEnabled = config.app?.sidebar?.default?.drawer?.enabled
  let appSidebarDefaultDrawerAttributes: { [attrName: string]: string } = {}
  if (appSidebarDefaultDrawerEnabled) {
    appSidebarDefaultDrawerAttributes = config.app?.sidebar?.default?.drawer?.attributes as {
      [attrName: string]: string
    }
  }

  const appSidebarDefaultStickyEnabled = config.app?.sidebar?.default?.sticky?.enabled
  let appSidebarDefaultStickyAttributes: { [attrName: string]: string } = {}
  if (appSidebarDefaultStickyEnabled) {
    appSidebarDefaultStickyAttributes = config.app?.sidebar?.default?.sticky?.attributes as {
      [attrName: string]: string
    }
  }

  setTimeout(() => {
    const sidebarElement = document.getElementById('kt_app_sidebar')
    // sidebar
    if (sidebarElement) {
      const sidebarAttributes = sidebarElement
        .getAttributeNames()
        .filter((t) => t.indexOf('data-') > -1)
      sidebarAttributes.forEach((attr) => sidebarElement.removeAttribute(attr))

      if (appSidebarDefaultDrawerEnabled) {
        for (const key in appSidebarDefaultDrawerAttributes) {
          if (Object.prototype.hasOwnProperty.call(appSidebarDefaultDrawerAttributes, key)) {
            sidebarElement.setAttribute(key, appSidebarDefaultDrawerAttributes[key])
          }
        }
      }

      if (appSidebarDefaultStickyEnabled) {
        for (const key in appSidebarDefaultStickyAttributes) {
          if (Object.prototype.hasOwnProperty.call(appSidebarDefaultStickyAttributes, key)) {
            sidebarElement.setAttribute(key, appSidebarDefaultStickyAttributes[key])
          }
        }
      }
    }
  }, 0)
}

export { Sidebar }


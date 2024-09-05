import {SidebarMenuMain} from './SidebarMenuMain'

const SidebarMenu = () => {
  return (
    <div className='app-sidebar-menu custom-sidebar overflow-y-auto flex-column-fluid hidden-scoll-bar'>
      <div
        id='kt_app_sidebar_menu_wrapper'
        className='app-sidebar-wrapper hover-scroll-overlay-y mb-6'
        data-kt-scroll='true'
        data-kt-scroll-activate='true'
        // data-kt-scroll-height='auto'
        data-kt-scroll-dependencies='#kt_app_sidebar_logo, #kt_app_sidebar_footer'
        data-kt-scroll-wrappers='#kt_app_sidebar_menu'
        data-kt-scroll-offset='5px'
        data-kt-scroll-save-state='true'
      >
        <div
          className='menu menu-column menu-sub-indention'
          id='#kt_app_sidebar_menu'
          data-kt-menu='true'
          data-kt-menu-expand='false'
        >
          <SidebarMenuMain />
        </div>
      </div>
    </div>
  )
}

export {SidebarMenu}

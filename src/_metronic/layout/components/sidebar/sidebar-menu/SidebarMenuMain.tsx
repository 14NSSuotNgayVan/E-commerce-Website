import { useEffect, useMemo, useState } from "react";
import { TMenu, TSubMenu } from "../../../../../app/pages/Homepage/listMenu";
import { headerConstant } from "../../header/header-menus/constant";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { checkMenuByPermissions } from "../../../../../app/modules/utils/FunctionUtils";
import { SidebarMenuWithSub } from "./SidebarMenuWithSub";
import useMultiLanguage from "../../../../../app/hook/useMultiLanguage";

const SidebarMenuMain = () => {
  const { lang } = useMultiLanguage();
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(document.body.offsetWidth <= 992);
  const listMenuSelect = localStorage.getItem(headerConstant?.LIST_SUB_MENU);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsTabletOrMobile(document.body.offsetWidth <= 992);
    }
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const listMenuParentSelect: TMenu[] = useMemo(() => {
    return isTabletOrMobile ? checkMenuByPermissions() : [];
  }, [isTabletOrMobile]);

  const [listMenuItem, setListMenuItem] = useState<TSubMenu[]>([]);
  const [listMenuParent, setListMenuParent] = useState<TMenu[]>([]);

  useEffect(() => {
    if (!listMenuSelect) return;
    setListMenuItem(JSON.parse(listMenuSelect));
  },[listMenuSelect])
  
  useEffect(() => {
    setListMenuParent(listMenuParentSelect);
  },[listMenuParentSelect])

  return (
    <>
      {isTabletOrMobile ? 
        listMenuParent.map((menu: TMenu, index: number) => (
          <SidebarMenuWithSub 
            key={index}
            to={menu.to}
            title={lang(menu?.title)}
            // icon={menu.icon}
            subMenu={menu.subMenu}
          >
            {menu.subMenu.map((menuItem: TSubMenu, index: number) => (
              <SidebarMenuItem
                key={index}
                to={menuItem.to}
                title={lang(menuItem?.title)}
                hasBullet={menuItem?.hasBullet}
                icon={menuItem.icon}
              />
            ))}
          </SidebarMenuWithSub>
        )) 
        : listMenuItem.map((menuItem: TSubMenu, index: number) => (
            <SidebarMenuItem
              key={index}
              to={menuItem.to}
              title={lang(menuItem?.title)}
              hasBullet={menuItem?.hasBullet}
              icon={menuItem.icon}
            />
          ))
      }
    </>
  );
};

export { SidebarMenuMain };


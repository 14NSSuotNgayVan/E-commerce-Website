import { MODULE, PERMISSIONS, PERMISSION_ABILITY } from "../../constants/Common"

export type TMenu = {
  title: string,
  to: string,
  name: string,
  permission: string,
  ability: string,
  subMenu: TSubMenu[]
}

export type TSubMenu = {
  title: string,
  to: string,
  hasBullet: boolean,
  icon: string
  permission: string,
  ability: string,
}

export const allMenu: TMenu[] = [
  {
    title: "GENERAL.APP.NAME",
    to: "/",
    name: "profile",
    permission: PERMISSIONS.MODULE,
    ability: MODULE.MANAGE,
    subMenu: [
      {
        title: "GENERAL.REPORT",
        to: "/report",
        hasBullet: false,
        icon: "/media/icons/file-chart-column.svg",
        permission: PERMISSIONS.REPORT,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.RECEIPT",
        to: "/receipt",
        hasBullet: false,
        icon: "/media/icons/memo-pad.svg",
        permission: PERMISSIONS.RECEIPT,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.ORDER",
        to: "/order-manager",
        hasBullet: false,
        icon: "/media/icons/clipboard-list-check.svg",
        permission: PERMISSIONS.ORDER,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.PROMOTION",
        to: "/promotion",
        hasBullet: false,
        icon: "/media/icons/badge-percent.svg",
        permission: PERMISSIONS.PROMOTION,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.PRODUCT",
        to: "/product",
        hasBullet: false,
        icon: "/media/icons/menu.svg",
        permission: PERMISSIONS.PRODUCT,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.CATEGORY",
        to: "/category",
        hasBullet: false,
        icon: "/media/icons/layer-group.svg",
        permission: PERMISSIONS.CATEGORY,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.SUPPLIER",
        to: "/supplier",
        hasBullet: false,
        icon: "/media/icons/truck-field.svg",
        permission: PERMISSIONS.SUPPLIER,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.COLOR",
        to: "/color",
        hasBullet: false,
        icon: "/media/icons/palette.svg",
        permission: PERMISSIONS.COLOR,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.SIZE",
        to: "/size",
        hasBullet: false,
        icon: "/media/icons/statistical.svg",
        permission: PERMISSIONS.SIZE,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.PAYMENT_METHOD",
        to: "/payment-method",
        hasBullet: false,
        icon: "/media/icons/money-check-dollar-pen.svg",
        permission: PERMISSIONS.PAYMENT,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.CUSTOMER",
        to: "/customer",
        hasBullet: false,
        icon: "/media/icons/users.svg",
        permission: PERMISSIONS.CUSTOMER,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.AUTHORITY",
        to: "/authority",
        hasBullet: false,
        icon: "/media/icons/shield-check.svg",
        permission: PERMISSIONS.AUTHORITY,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.ROLE",
        to: "/roles",
        hasBullet: false,
        icon: "/media/icons/hand.svg",
        permission: PERMISSIONS.ROLE,
        ability: PERMISSION_ABILITY.VIEW,
      },
      {
        title: "GENERAL.USER",
        to: "/user",
        hasBullet: false,
        icon: "/media/icons/file-user.svg",
        permission: PERMISSIONS.USER,
        ability: PERMISSION_ABILITY.VIEW,
      },

    ]
  },
]
import { IRole } from "../../roles/models/RoleModel"
import { IUser } from "../../user/models/UserModel"

export interface AuthModel {
  access_token: string
  token_type?: string
  refresh_token?: string
  expires_in: number
  scope?: string
  jti?: string
  expires_date_out?: number
}

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}

export interface UserModel {
  id: number
  username: string
  password: string | undefined
  email: string
  first_name: string
  last_name: string
  fullName?: string
  occupation?: string
  companyName?: string
  phone?: string
  role?: Array<number>
  pic?: string
  language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  timeZone?: string
  website?: 'https://keenthemes.com'
  emailSettings?: UserEmailSettingsModel
  auth?: AuthModel
  communication?: UserCommunicationModel
  address?: UserAddressModel
  socialNetworks?: UserSocialNetworksModel
  user?: any
}

export interface ResponseModel<T = any> {
  apiSubErrors?: null | string
  code: number
  data: T
  message?: string
  error?: string
  error_description?: string
  timestamp: string
}

export interface ResponseToken {
  authorities: string[];
  exp?: number;
  iat?: number;
  user: IUser;
}
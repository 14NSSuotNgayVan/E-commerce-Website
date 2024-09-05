import axios from 'axios'
import { AuthModel, ResponseModel, ResponseToken } from './_models'
import { paramsConfig } from "~/app/modules/utils/ParamsUtils";

const API_URL = process.env.API_URL

export const GET_USER_BY_ACCESS_TOKEN_URL = `${API_URL}/oauth/check_token`
export const LOGIN_URL = `${API_URL}/oauth/token`
export const VERIFY_EMAIL_URL = `${API_URL}/oauth/verify-email`
export const REGISTER_URL = `${API_URL}/oauth/signup `
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<ResponseModel<AuthModel>>(LOGIN_URL, new URLSearchParams({
    username: email, //gave the values directly for testing
    password: password,
    client_id: 'core_client',
    grant_type: 'password',
    client_secret: 'secret'
  }))
}

// Server should return AuthModel
export function register(
  tenKhachHang: string,
  username: string,
  email: string,
  password: string,
) {
  return axios.post(REGISTER_URL, {
    email: email,
    tenKhachHang: tenKhachHang,
    password: password,
    username: username,
  })
}
export function verifyEmail (token :string){
  return axios.get(VERIFY_EMAIL_URL,paramsConfig({token}))
}
// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function getUserByToken(token: string) {
  const checkTokenRequest = axios.create();
  return checkTokenRequest.post<ResponseModel<ResponseToken>>(GET_USER_BY_ACCESS_TOKEN_URL, {}, {
    ...paramsConfig({ token }),
    headers: { Authorization: 'Basic Y29yZV9jbGllbnQ6c2VjcmV0' }
  })
}

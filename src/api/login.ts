import request from '@/utils/request'

const Api = {
  login : '/login',
}

export function userLogin(params) {
  return request.post(Api.login, params)
}

export function userLogin2(params) {
  return request.post(Api.login, params)
}

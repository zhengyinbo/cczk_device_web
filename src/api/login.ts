import request from '@/utils/request'

const Api = {
  login : '/login',
  role : '/role',
}

export function userLogin(params) {
  return request.post(Api.login, params)
}

export function getRole() {
  return request.get(Api.role)
}

import request from '@/utils/request'

const Api = {
  queryList : '/user/list',
  createUser : '/user/create',
}

export function queryList(params) {
  return request.get(Api.queryList, {params})
}

export function createUser(params) {
  return request.post(Api.createUser, params)
}

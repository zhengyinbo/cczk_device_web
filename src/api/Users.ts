import request from '@/utils/request'

const Api = {
  queryList : '/user/list',
  createUser : '/user/create',
  updateUser : '/user/update',
  bandUser : '/user/band',
  findAll : '/user/findAll'
}

export function queryList(params) {
  return request.get(Api.queryList, {params})
}

export function createUser(params) {
  return request.post(Api.createUser, params)
}

export function updateUser(params) {
  return request.post(Api.updateUser, params)
}

export function bandUser(params) {
  return request.post(Api.bandUser, params)
}

export function findAll() {
  return request.get(Api.findAll)
}


import request from '@/utils/request'

const Api = {
  deviceList : '/device/list',
  createDevice : '/device/create',
  updateDevice : '/device/update',
  deleteDevice : '/device/delete',
  cateList: 'deviceType/list',
  createCate: 'deviceType/create',
  updateCate: 'deviceType/update',
  deleteCate: 'deviceType/delete',
  findAllCate: 'deviceType/findAll',
}

export function deviceList(params) {
  return request.get(Api.deviceList, {params})
}

export function createDevice(params) {
  return request.post(Api.createDevice, params)
}

export function updateDevice(params) {
  return request.post(Api.updateDevice, params)
}

export function deleteDevice(params) {
  return request.post(Api.deleteDevice, params)
}

export function findAllCate() {
  return request.get(Api.findAllCate)
}

export function cateList(params) {
  return request.get(Api.cateList, {params})
}

export function createCate(params) {
  return request.post(Api.createCate, params)
}

export function updateCate(params) {
  return request.post(Api.updateCate, params)
}

export function deleteCate(params) {
  return request.post(Api.deleteCate, params)
}

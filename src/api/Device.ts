import request from '@/utils/request'

const Api = {
  deviceList : '/device/list',
  createDevice : '/device/create',
  updateDevice : '/device/update',
  deleteDevice : '/device/delete',
  bandDevice : '/device/band',
  unBandDevice : '/device/unBand',
  cateList: 'deviceType/list',
  createCate: 'deviceType/create',
  updateCate: 'deviceType/update',
  deleteCate: 'deviceType/delete',
  findAllCate: 'deviceType/findAll',
  updateConfig: 'device/config/update',
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

export function unBandDevice(params) {
  return request.post(Api.unBandDevice, params)
}

export function bandDevice(params) {
  return request.post(Api.bandDevice, params)
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

export function updateConfig(params) {
  return request.post(Api.updateConfig, params)
}

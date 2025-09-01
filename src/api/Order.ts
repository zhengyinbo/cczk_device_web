import request from '@/utils/request'

const Api = {
  queryList : '/orders/list'
}
// eslint-disable-next-line import/prefer-default-export
export function queryList(params: any) {
  return request.get(Api.queryList, {params})
}

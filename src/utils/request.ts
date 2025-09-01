import axios from 'axios';
import store from '@/store'
import router from '@/router'
import { Message } from 'tdesign-vue'
import proxy from '../config/host';

const env = import.meta.env.MODE || 'development';

const API_HOST = env === 'mock' ? '/' : proxy[env].API; // 如果是mock模式 就不配置host 会走本地Mock拦截

const CODE = {
  LOGIN_TIMEOUT: 1000,
  REQUEST_SUCCESS: 0,
  REQUEST_FOBID: 1001,
};

const instance = axios.create({
  baseURL: API_HOST,
  timeout: 1000,
  withCredentials: true,
});

// eslint-disable-next-line
// @ts-ignore
// axios的retry ts类型有问题
instance.interceptors.retry = 3;

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const {token} = store.state.user  // 从 Vuex 里取
    if (token) {
      // config.headers.Authorization = `Bearer ${token}`  // 常见写法
      console.log("token - ")
      console.log(token)
      console.log("token = ")
      config.headers.token = token
      // 也可能是 config.headers['token'] = token
      // 具体看你们后端怎么要求的
    }
    return config
  },
  (error) => Promise.reject(error)
)


instance.interceptors.response.use(
  (response) => {
    // console.log(response);
    if (response.status === 200) {
      const { data } = response;
      // if (data.code === CODE.REQUEST_SUCCESS) {
      //   return data;
      // }
      // return response;
      return data;
    }
  },
  (err) => {
    if (err.response.data.code && err.response.data.code === 1001) {
      // 未登录，清空本地缓存
      localStorage.removeItem('token')

      // 跳转到登录页
      router.push({ path: '/login' })

      // 也可以提示一下
      Message.error('请重新登录')

      return Promise.reject(new Error('未登录'))
    }
    const { config } = err;

    if (!config || !config.retry) return Promise.reject(err);

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
      return Promise.reject(err);
    }

    config.retryCount += 1;

    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, config.retryDelay || 1);
    });

    return backoff.then(() => instance(config));
  },
);

export default instance;

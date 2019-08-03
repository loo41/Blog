import axios from './axios'

export const getArticle = (params) => {
  return axios.request({
    url: '/repos/loo41/Blog/issues',
    params,
    method: 'get'
  })
}

export const getUserInfo = (params) => {
  return axios.request({
    url: '/users/loo41',
    params,
    method: 'get'
  })
}
import axios from './axios'
import Config from '../../blog.config'

export const getArticle = (params) => {
  params.client_id = Config.user.client_id
  params.client_secret = Config.user.client_secret
  return axios.request({
    url: '/repos/loo41/Blog/issues',
    params,
    method: 'get'
  })
}

export const getUserInfo = (params = {}) => {
  params.client_id = Config.user.client_id
  params.client_secret = Config.user.client_secret
  return axios.request({
    url: '/users/loo41',
    params,
    method: 'get'
  })
}
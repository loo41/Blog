import Vue from 'vue'
import Vuex from 'vuex'
import { getArticle, getUserInfo } from './request'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    labels: [],
    isData: true,
    article: [],
    userInfo: {},
    searchIndex: null
  },
  mutations: {
    setLabels(state, labels) {
      state.labels = [...new Set(state.labels.concat(labels))]
    },
    setArticle(state, article) {
      localStorage.setItem('article', JSON.stringify(article));
      state.article = article
    },
    getSetArticle (state) {
      state.article = JSON.parse(localStorage.getItem('article')) || []
    },
    setIsData(state, isData) {
      state.isData = isData
    },
    setSearchIndex(state, index) {
      state.searchIndex = index
    },
    setUserInfo(state, userinfo) {
      state.userInfo = userinfo
    },
  },
  actions: {
    getData ({commit}, params) {
      return new Promise((resolve, reject) => {
        getArticle(params).then((result) => {
          if (params.page === 1 && !result.data.length) return commit('setIsData', false)
          const labels = []
          result.data.forEach(item => {
            if (item.labels && item.labels.length) {
              labels.push(...item.labels.map((label => label.name)))
            }
          })
          commit('setLabels', [...new Set(labels)])
          commit('setArticle', result.data)
          resolve()
        }).catch(e => {
          console.log(e)
          reject()
        })
      })
    },
    getUserInfo({commit}) {
      getUserInfo().then(result => {
        commit('setUserInfo', result.data)
      }).catch(e => {
        console.log(e)
      })
    }
  }
})

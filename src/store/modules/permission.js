import { asyncRoutes, constantRoutes } from '@/router'
const state = {
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]// 静态路由  + 动态路由
  }
}
const actions = {
  filterRoutes(context, menus) {
    var routes = []
    menus.forEach(item => {
      routes.push(...asyncRoutes.filter(route => route.name === item))
    })
    context.commit('setRoutes', routes)
    return routes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

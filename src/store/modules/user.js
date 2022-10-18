import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
  // 设置Token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 设置删除Token
  removeToken(state) {
    state.token = null
    removeToken() // 删除缓存
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }// 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result)
    setTimeStamp() // 写入时间戳
  },
  // 获取用户信息
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    const baseInfo = await getUserDetailById(result.userId)// 为了获取头像
    const baseResult = { ...result, ...baseInfo }
    context.commit('setUserInfo', baseResult) // 将整个的个人信息设置到用户的vuex数据中
    return baseResult // 这里为什么要返回 为后面埋下伏笔
  },
  // 登出
  logout(context) {
    context.commit('removeToken') // 删除Token
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    // 要清空permission模块下的state数据
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

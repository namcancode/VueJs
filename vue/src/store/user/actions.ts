import request from '@/plugins/request'
import { ActionTree } from 'vuex'
import router from '@/router'
import { IUserState } from '@/store/user'

const actions: ActionTree<IUserState, any> = {
  async login({ commit }, { username, password }) {
    try {
      const rs = await request.post('basic-login', { username, password })
      commit('LOGIN_SUCCESS', rs.data)
      router.push({name: 'home'})
    } catch (err) {
      commit('LOGIN_FAIL')
    }
  },
  async logout({ commit }) {
    await request.get('logout')
    commit('LOGOUT')
  },
  async changeLang({ commit }) {
    request.get('auth/change-lang')
    commit('CHANGE_LANG')
  }
}

export default actions

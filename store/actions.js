import Services from './services'
import axios from 'axios'

export default {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.user) {
      const { email, nickname } = req.session.user
      const user = {
        email,
        nickname
      }

      commit('SET_USER', user)
    }
  },
  async login ({ commit }, { email, password }) {
    try {
      let res = await axios.post('/admin/login', {
        email,
        password
      })

      let { data } = res
      if (data.success) {
        commit('SET_USER', data.data)
      } else {
        commit('SET_USER', null)
      }

      return data
    } catch (e) {
      if (e.response.status === 401) {
        throw new Error('You can\'t do it')
      }
    }
  },

  async logout ({ commit }) {
    await axios.post('/admin/logout')
    commit('SET_USER', null)
  },
  async addUser ({ state, dispatch }, userMsg) {
    await axios.post('/admin/addUser', userMsg)

    let res = await dispatch('fetchUsers')

    return res.data.data
  },
  async fetchUsers ({ state }) {
    const res = await Services.fetchUsers()

    state.users = res.data.data

    return res
  },
  async fetchProblems ({ state }, page) {
    const res = await Services.fetchProblems(page)

    state.problems = res.data

    return res
  },
  async fetchUnsolvedProblems ({ state }, page) {
    const res = await Services.fetchUnsolvedProblems(page)

    state.unsolvedproblems = res.data

    return res
  },
  async addReply ({ state }, reply) {
    reply.email = state.user.email

    await axios.post('/admin/addReply', reply)

    return { success: true }
  },
  async fetchProblemReply ({ state }, page) {
    const res = await Services.fetchProblemReply(page)

    state.problemReply = res.data

    return res
  },
  async deleteReply ({ state, dispatch }, id) {
    const res = await Services.deleteReply(id)
    // const res =  await axios.post('/admin/deleteReply', id)
    await dispatch('fetchProblemReply')

    return res.data
  }
}

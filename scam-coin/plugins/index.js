import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'; // axios import 추가

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = '';
      localStorage.removeItem('token');
    }
  },
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.post('http://3.37.88.98:8000/user/login', {
          username,
          password
        });
        const token = response.data.token;
        commit('setToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('로그인에 실패했습니다.', error);
        throw error; // 에러 처리를 위해 예외를 던집니다.
      }
    },
    logout({ commit }) {
      commit('clearToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
});

import Vue from 'vue';

export default function ({ $axios, store, redirect }) {
  $axios.onRequest(config => {
    const token = store.state.token;
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }
  });

  $axios.onError(error => {
    if (process.client) {
      if (error.response.status === 401) {
        Vue.toasted.show('로그인을 하고 사용해주세요.', { type: 'error' });
        store.dispatch('logout');
        redirect('/login');
      } else if (error.response.status === 404) {
        Vue.toasted.show('존재하지 않습니다.', { type: 'error' });
      } else if (error.response.status === 403) {
        Vue.toasted.show('접근 권한이 없습니다.', { type: 'error' });
      } else if (error.response.status === 422) {
        Vue.toasted.show('올바른 형식을 입력하세요.', { type: 'error' });
      }
    }
    return Promise.reject(error);
  });
}

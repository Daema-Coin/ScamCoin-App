<template>
  <div class="login-container">
    <div class="login-header">
      <h2>로그인</h2>
    </div>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="account_id">아이디</label>
        <input v-model="account_id" type="text" id="account_id" placeholder="아이디" :class="{ 'error': formError }" />
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input v-model="password" type="password" id="password" placeholder="비밀번호" :class="{ 'error': formError }" />
      </div>
      <div class="button-container">
        <button type="submit" class="login-button">로그인 →</button>
        <p v-if="formError" class="error-message">아이디와 비밀번호를 입력해주세요.</p>
        <p v-if="loginError" class="error-message">로그인 중 오류가 발생했습니다.</p>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { store, mutations } from '../plugins/token';

export default {
  data() {
    return {
      account_id: '',
      password: '',
      formError: false,
      loginError: false,
    };
  },
  methods: {
    async login() {
      console.log('Login button clicked'); // 로그인 버튼 클릭 확인 로그
      this.formError = !this.account_id || !this.password;

      if (!this.formError) {
        try {
          console.log('Sending POST request to login'); // POST 요청 전 로그
          const response = await axios.post('http://3.37.88.98:8000/user/login', {
            account_id: this.account_id,
            password: this.password
          });

          if (response.status === 200 || response.status === 201) {
            const token = response.data.token;
            console.log('Login successful, token received:', token); // 로그인 성공 후 토큰 출력
            mutations.setToken(token);
            console.log('Token set in store:', store.token); // 토큰 저장 확인 로그
            axios.defaults.headers.common['Authorization'] = `Bearer ${store.token}`;
            this.$router.push('/home');
          } else {
            this.loginError = true;
          }
        } catch (error) {
          this.loginError = true;
          console.error('로그인 요청 중 오류 발생:', error);
        }
      }
    },
  },
};
</script>
<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  /* Spread elements evenly */
  height: 100vh;
  background-color: #fff;
  padding: 20px;
  /* Add padding to ensure the header is not too close to the top */
}

.login-header {
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  flex-grow: 1;
  justify-content: flex-start;
}

h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  height: 50px;
  padding: 10px;
  margin-top: 5px;
  border-radius: 12px;
  border: 1px solid #f7f7f7;
  background-color: #f7f7f7;
  box-sizing: border-box;
}

input.error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
  text-align: center;
}

.button-container {
  margin-top: auto;
  width: 100%;
  padding-bottom: 40px;
}

.login-button {
  width: 100%;
  height: 45px;
  padding: 10px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  box-sizing: border-box;
}

.login-button:hover {
  background-color: #357ae8;
}

@media (max-width: 600px) {
  .login-container {
    padding: 10px;
  }

  .login-form {
    padding: 0;
  }

  .login-button {
    padding: 12px;
    font-size: 1.1em;
  }
}

@media (max-width: 320px) {
  .login-container {
    padding: 5px;
  }

  .login-form {
    padding: 0;
  }

  .login-button {
    padding: 10px;
    font-size: 0.9em;
  }
}
</style>

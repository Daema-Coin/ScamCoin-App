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
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      account_id: '',
      password: '',
      formError: false,
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      this.formError = false;
      this.errorMessage = '';

      if (!this.account_id || !this.password) {
        this.formError = true;
        return;
      }

      try {
        const response = await axios.post('http://3.37.88.98:8000/user/login', {
          account_id: this.account_id,
          password: this.password
        });
        
        // HTTP 상태 코드가 200이나 201이면 토큰을 localStorage에 저장
        if (response.status === 200 || response.status === 201) {
          const token = response.data.token;
          localStorage.setItem('token', token); // 토큰을 localStorage에 저장
        }

        // 로그인 성공 후 다음 페이지로 이동
        this.$router.push('/home');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = '아이디나 비밀번호가 올바르지 않습니다.';
        } else {
          this.errorMessage = '로그인 중 오류가 발생했습니다.';
        }
        console.error('로그인에 실패했습니다.', error);
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  background-color: #fff;
  padding: 20px;
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

<template>
  <div class="login-container">
    <form @submit.prevent="submitForm">
      <h1>로그인</h1>
      <div class="form-group">
        <label for="account_id">아이디</label>
        <input
          v-model="account_id"
          type="text"
          id="account_id"
          placeholder="아이디"
          :class="{'error': accountIdError}"
        />
        <p v-if="accountIdError" class="error-message">아이디를 입력해주세요.</p>
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="비밀번호"
          :class="{'error': passwordError}"
        />
        <p v-if="passwordError" class="error-message">비밀번호를 입력해주세요.</p>
      </div>
      <button type="submit" class="login-button">로그인 →</button>
      <p v-if="loginError" class="error-message">로그인 중 오류가 발생했습니다.</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account_id: '',
      password: '',
      accountIdError: false,
      passwordError: false,
      loginError: false,
    };
  },
  methods: {
    async submitForm() {
      this.accountIdError = !this.account_id;
      this.passwordError = !this.password;

      if (!this.accountIdError && !this.passwordError) {
        try {
          // 로그인 요청
          const response = await this.$axios.post('/user/login', {
            account_id: this.account_id,
            password: this.password
          });

          if (response.data.success) {
            // 토큰 저장
            const token = response.data.token;
            this.$store.dispatch('login', token);
            this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // 로그인 성공 시 홈으로 이동
            this.$router.push('/home');
          } else {
            this.loginError = true;
          }
        } catch (error) {
          this.loginError = true;
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
  justify-content: center;
  height: 100vh;
  background-color: #fff; /* 모달 배경을 제거하고 흰색 배경 */
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px; /* 최대 너비 설정 */
  padding: 0 20px; /* 좌우 여백 추가 */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 12px;
  border: 1px solid #f7f7f7;
  background-color: #f7f7f7;
}

input.error {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.login-button:hover {
  background-color: #357ae8;
}

/* 반응형 디자인 추가 */
@media (max-width: 600px) {
  .login-container {
    padding: 10px;
  }

  form {
    padding: 0;
  }

  .login-button {
    padding: 12px;
    font-size: 1.1em;
  }
}

/* 아이폰 SE 1세대에 맞춘 스타일 */
@media (max-width: 320px) {
  .login-container {
    padding: 5px;
  }

  form {
    padding: 0;
  }

  .login-button {
    padding: 10px;
    font-size: 0.9em;
  }
}
</style>

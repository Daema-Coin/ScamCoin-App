import { ref } from 'vue';
import axios from 'axios';

export default function useLogin() {
  const loading = ref(false);
  const error = ref(null);

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post('/user/login', credentials);
      loading.value = false;
      return response.data;
    } catch (err) {
      loading.value = false;
      error.value = err.response ? err.response.data.message : err.message;
    }
  };

  return {
    loading,
    error,
    login,
  };
}

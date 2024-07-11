import Vue from 'vue';
import Toasted from 'vue-toasted';

if (process.client) {
  Vue.use(Toasted, {
    duration: 5000,
    position: 'top-right',
    singleton: true,
  });
}

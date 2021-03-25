import { createStore } from 'vuex';
import modules from '@/store/modules';
import createPersistedState from 'vuex-persistedstate';

const web3State = createPersistedState({
  paths: ['web3']
});

const store = createStore({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  plugins: [web3State]
});

export default store;

import { Web3Provider } from '@ethersproject/providers';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import store from '@/store';
import { importIotexAccount } from '@/auth';
import { formatUnits } from '@ethersproject/units';
import { getProfiles } from '@/helpers/profile';
import sleepPromise from 'sleep-promise';
import Antenna from 'iotex-antenna';
import { WsSignerPlugin } from 'iotex-antenna/lib/plugin/ws';

let wsProvider;
let auth;
const defaultNetwork =
  process.env.VUE_APP_DEFAULT_NETWORK || Object.keys(networks)[0];

if (wsProvider) {
  wsProvider.on('block', blockNumber => {
    store.commit('GET_BLOCK_SUCCESS', blockNumber);
  });
}

const state = {
  account: null,
  name: null,
  network: 'testnet.iotex'
};

const mutations = {
  HANDLE_CHAIN_CHANGED(_state, chainId) {
    if (!networks[chainId]) {
      networks[chainId] = {
        ...networks[defaultNetwork],
        chainId,
        name: 'Unknown',
        network: 'unknown',
        unknown: true
      };
    }
    _state.network = networks[chainId];
    console.debug('HANDLE_CHAIN_CHANGED', chainId);
  },
  WEB3_SET(_state, payload) {
    Object.keys(payload).forEach(key => {
      _state[key] = payload[key];
    });
  }
};

const actions = {
  checkAuth: async ({ state }) => {
    console.log('check auth', state);
    if (state.account) {
      auth = getInstance();
      auth.isAuthenticated = {
        value: true
      };
    }
  },

  loginWithIotex: async ({ commit }, address: string) => {
    auth = getInstance();
    commit('SET', { authLoading: true });
    const account = await importIotexAccount(address);
    auth.web3 = {
      isAuthenticated: {
        value: true
      }
    };
    commit('WEB3_SET', { account: account.address, profile: null });
    commit('SET', { authLoading: false });
  },

  loginWithIopay: async ({ commit }) => {
    commit('SET', { authLoading: true });

    const antenna = new Antenna('http://api.iotex.one:80', {
      signer: new WsSignerPlugin()
    });

    await sleepPromise(3000);

    commit('WEB3_SET', {
      account: antenna.iotx.accounts[0].address,
      profile: null
    });
    commit('SET', { authLoading: false });
  },

  login: async ({ dispatch, commit }, connector = 'injected') => {
    auth = getInstance();
    commit('SET', { authLoading: true });
    await auth.login(connector);
    if (auth.provider.value) {
      auth.web3 = new Web3Provider(auth.provider.value);
      await dispatch('loadProvider');
    }
    commit('SET', { authLoading: false });
  },
  logout: async ({ commit }) => {
    auth = getInstance();
    auth.logout();
    commit('WEB3_SET', { account: null, profile: null });
  },
  loadProvider: async ({ commit, dispatch }) => {
    try {
      if (
        auth.provider.value.removeAllListeners &&
        !auth.provider.value.isTorus
      )
        auth.provider.value.removeAllListeners();
      if (auth.provider.value.on) {
        auth.provider.value.on('chainChanged', async chainId => {
          commit('HANDLE_CHAIN_CHANGED', parseInt(formatUnits(chainId, 0)));
        });
        auth.provider.value.on('accountsChanged', async accounts => {
          if (accounts.length !== 0) {
            commit('WEB3_SET', { account: accounts[0] });
            await dispatch('loadProvider');
          }
        });
        // auth.provider.on('disconnect', async () => {});
      }
      console.log('Provider', auth.provider.value);
      let network, accounts;
      try {
        [network, accounts] = await Promise.all([
          auth.web3.getNetwork(),
          auth.web3.listAccounts()
        ]);
      } catch (e) {
        console.log(e);
      }
      commit('HANDLE_CHAIN_CHANGED', network.chainId);
      const account = accounts.length > 0 ? accounts[0] : null;
      const profiles = await getProfiles([account]);
      commit('WEB3_SET', {
        account,
        profile: profiles[account]
      });
    } catch (e) {
      commit('WEB3_SET', { account: null, profile: null });
      return Promise.reject(e);
    }
  }
};

export default {
  state,
  mutations,
  actions
};

import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import store from '@/store';
import { importIotexAccount, authWithIopay } from '@/auth';
import { Account } from 'iotex-antenna/lib/account/account';
import client from '@/helpers/client';

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

const authServer = async (account: Account): Promise<boolean> => {
  const result: any = await client.request('create-nonce', {});
  const msg = `${account.address}/${result.nonce}`;
  const sign = await account.sign(msg);
  const data = (await client.request('sign-in', {
    sign: sign.toString('hex'),
    address: account.address
  })) as { ok: boolean };
  return data.ok;
};

const notifyAuth = (commit, result) => {
  if (result) {
    commit('notify', { message: 'Successful Login', type: 'green' });
  } else {
    commit('notify', { message: 'Failed Login', type: 'red' });
  }
};

const setAuth = async (
  account: Account | null,
  address?: string
): Promise<boolean> => {
  auth = getInstance();
  if (auth.web3 && auth.web3.isAuthenticated) {
    return true;
  }
  try {
    let isAuthed = true;
    if (account) {
      auth.account = account;
      isAuthed = await authServer(auth.account);
    }
    if (address) {
      auth.account = await importIotexAccount(address);
    }
    if (auth) {
      auth.web3 = {
        isAuthenticated: {
          value: true
        }
      };
    }
    return isAuthed;
  } catch (e) {
    return false;
  }
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
  checkAuth: async ({ state: _state, commit }) => {
    if (_state.account) {
      const result = await setAuth(null, _state.account);
      notifyAuth(commit, result);
    }
  },

  loginWithIopay: async ({ commit }) => {
    commit('SET', { authLoading: true });
    try {
      const account = await authWithIopay();
      const result = await setAuth(account);
      notifyAuth(commit, result);
      if (result) {
        commit('WEB3_SET', {
          account: account.address,
          profile: null
        });
      }
    } catch (e) {
      notifyAuth(commit, false);
    } finally {
      commit('SET', { authLoading: false });
    }
  },

  logout: async ({ commit }) => {
    auth = getInstance();
    auth.logout();
    commit('WEB3_SET', { account: null, profile: null });
  }
};

export default {
  state,
  mutations,
  actions
};

const state = {
  items: []
};

const mutations = {
  notify(_state, payload) {
    _state.items.push({ ...payload, timestamp: Date.now() });
  }
};

const actions = {
  notify({ commit }, payload) {
    Array.isArray(payload)
      ? commit('notify', { message: payload[1], type: payload[0] })
      : commit('notify', { message: payload, type: 'green' });
  },

  notifyOpenIoPay({ commit }) {
    commit('notify', { message: 'Please open IoPay to sign', type: 'red' });
  },

  notifySignSuccessfully({ commit }) {
    commit('notify', { message: 'Sign Message Successfully' });
  }
};

export default {
  state,
  mutations,
  actions
};

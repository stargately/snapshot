<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3 v-if="!web3.account || step === 'connect'">Connect wallet</h3>
      <div v-else>
        <h3>Account</h3>
        <p>{{ web3.account }}</p>
        <a
          :href="`https://testnet.iotexscan.io/address/${web3.account}`"
          target="_blank"
          class="mb-2 d-block"
        >
          <UiButton class="button-outline width-full v-align-middle">
            View on IoTex
          </UiButton>
        </a>
        <UiButton
          @click="handleLogout"
          class="button-outline width-full v-align-middle"
        >
          Logout
        </UiButton>
      </div>
    </template>
    <div v-if="!web3.account && step !== 'import'">
      <UiButton
        class="button-outline width-full v-align-middle"
        @click="loginWithIopay"
      >
        login with IoPay
      </UiButton>
    </div>
    <div v-if="step === 'import'">
      <form>
        <input
          v-model="privateKey"
          class="form-control input-block"
          type="text"
          placeholder="address"
        />
        <UiButton
          class="button-outline width-full v-align-middle"
          @click="importAccount"
        >
          Import
        </UiButton>
      </form>
    </div>
    <div v-else>
      <div v-if="$auth.isAuthenticated.value" class="m-4">
        <UiButton
          @click="handleLogout"
          class="button-outline width-full text-red mb-2"
        >
          Log out
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['open'],
  emits: ['login', 'close'],
  data() {
    return {
      step: null,
      privateKey: ''
    };
  },
  watch: {
    open() {
      this.step = null;
    }
  },
  methods: {
    ...mapActions(['logout', 'loginWithIopay']),
    async handleLogout() {
      await this.logout();
      this.$emit('close');
    },
    async importAccount() {
      if (this.privateKey) {
        await this.loginWithIotex(this.privateKey);
      }
      console.log(this.web3);
      this.$emit('close');
    }
  }
};
</script>

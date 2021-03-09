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
            view on iotex
          </UiButton>
        </a>
      </div>
    </template>
    <div v-if="!web3.account && step !== 'import'">
      <a
        href="https://beancount.io/wallet"
        target="_blank"
        class="mb-2 d-block"
      >
        <UiButton
          class="button-outline width-full v-align-middle"
          @click="createAccount"
        >
          create iotex account
        </UiButton>
      </a>
      <UiButton
        class="button-outline width-full v-align-middle"
        @click="toImportForm"
      >
        import iotex
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
    ...mapActions(['logout', 'loginWithIotex']),
    async handleLogout() {
      await this.logout();
      this.$emit('close');
    },
    toImportForm() {
      this.step = 'import';
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

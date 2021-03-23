<template>
  <Layout>
    <template #content-left>
      <div class="px-4 px-md-0 mb-3">
        <router-link :to="{ name: 'home' }" class="text-gray">
          <Icon name="back" size="22" class="v-align-middle" />
          Home
        </router-link>
      </div>
      <div class="px-4 px-md-0">
        <h1 v-text="'Create a space'" class="mb-4" />
      </div>
      <Block>
        <div class="mb-3">
          Choose a space name
        </div>
        <UiButton class="text-left width-full mb-3 d-flex px-3">
          <input
            v-model="id"
            class="input flex-auto"
            placeholder="e.g. a.iotex"
          />
        </UiButton>
        <UiButton
          :disabled="id.length === 0"
          @click="handleSubmit"
          class="button--submit width-full"
        >
          Next
        </UiButton>
      </Block>
    </template>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      id: ''
    };
  },
  methods: {
    handleSubmit() {
      this.$router.push({
        name: 'settings',
        params: { key: this.id.toLowerCase() }
      });
    }
  }
};
</script>

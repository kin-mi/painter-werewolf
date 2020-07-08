<template>
  <div class="wrapper">
    <div class="mb-4">
      <input
        id="username"
        class="input"
        :class="inputClass"
        type="text"
        placeholder="ユーザー名を入力してください"
        :value="displayName"
        @input="$emit('input', $event.target.value)"
      />
    </div>
    <LoginButton
      :is-disabled="!this.$accessor.auth.ready || !displayName"
      @click="$emit('click')"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import LoginButton from '~/components/LoginButton.vue'

export default Vue.extend({
  components: { LoginButton },
  props: { displayName: { type: String, default: '' } },
  computed: {
    inputClass(): string[] {
      return this.displayName ? ['text-lg', 'font-bold'] : ['text-xs']
    },
  },
})
</script>
<style scoped>
.wrapper {
  @apply w-full;
  @apply max-w-xs;
  @apply py-5;
  @apply mx-auto mt-3;
  @apply bg-base-dark;
  @apply border-2 border-base-darkness;
  @apply shadow-inner;
  @apply rounded-full;
}
.input {
  @apply w-48;
  @apply h-8;
  @apply shadow;
  @apply appearance-none;
  @apply rounded;
  @apply py-2 px-3;
  @apply leading-tight;
  @apply border-b-4 border-orange-500;
  @apply bg-base-light;
  @apply text-center;
  @apply text-orange-500;
  @apply transition duration-300 ease-in-out;
}
.input:focus {
  @apply transform border-orange-700 text-orange-700;
  @apply outline-none;
}
</style>

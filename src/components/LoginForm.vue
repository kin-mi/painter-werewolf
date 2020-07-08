<template>
  <div class="wrapper">
    <div class="mb-3">
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
    <div class="flex items-center justify-center flex-wrap mb-6 px-5">
      <template v-for="(icon, index) in icons">
        <label :key="icon" class="inline-flex items-center w-1/5">
          <input
            :id="`icon_${index}`"
            v-model="selectedIcon"
            type="radio"
            :value="index"
            class="appearance-none"
          />
          <img
            class="h-10 w-10 rounded-full border border-gray-500 bg-paint-gray cursor-pointer"
            :src="icon"
          />
        </label>
      </template>
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
import { IconFileName } from '~/utils/constant'

export default Vue.extend({
  components: { LoginButton },
  props: { displayName: { type: String, default: '' } },
  data() {
    return {
      selectedIcon: '0',
    }
  },
  computed: {
    inputClass(): string[] {
      return this.displayName ? ['text-lg', 'font-bold'] : ['text-xs']
    },
    icons(): any[] {
      return IconFileName.map((e) => require(`~/assets/images/${e}`))
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
  @apply bg-white;
  @apply text-center;
  @apply text-orange-500;
  @apply transition duration-300 ease-in-out;
  --bg-opacity: 0.6;
}
.input:focus {
  @apply transform border-orange-700 text-orange-700;
  @apply outline-none;
}
input[type='radio']:checked + img {
  @apply bg-paint-green border-paint-bule;
}
</style>

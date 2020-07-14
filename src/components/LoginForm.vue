<template>
  <div class="wrapper">
    <div class="mt-2 mb-3">
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
    <div class="flex items-center justify-center flex-wrap mb-2 px-5">
      <template v-for="(icon, index) in icons">
        <label
          :key="`icon${index}`"
          class="inline-flex items-center justify-center w-1/5"
        >
          <input
            :id="`icon_${index + 1}`"
            :name="`icon`"
            type="radio"
            :value="index + 1"
            :checked="String(index + 1) === selectedIcon"
            class="appearance-none"
            @change="$emit('selected', $event.target.value)"
          />
          <img
            class="h-10 w-10 rounded-full border border-gray-500 bg-paint-gray cursor-pointer"
            :src="icon"
          />
        </label>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { IconFileName } from '~/utils/constant'

export default Vue.extend({
  props: {
    displayName: { type: String, default: '' },
    selectedIcon: { type: String, default: '' },
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
  @apply py-4;
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
  @apply border-b-4 border-paint-leather-red;
  @apply bg-white;
  @apply text-center;
  @apply text-paint-leather-red;
  @apply transition duration-300 ease-in-out;
  --bg-opacity: 0.6;
}
.input:focus {
  @apply transform border-orange-700 text-orange-700;
  @apply outline-none;
}
input[type='radio']:checked + img {
  @apply bg-paint-green border-paint-blue shadow-xl;
}
</style>

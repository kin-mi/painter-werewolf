<template>
  <div class="flex items-center justify-center">
    <button
      class="btn-primary"
      type="button"
      :disabled="isDisabled"
      @click="$emit('click')"
    >
      <slot />
    </button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    isDisabled: { default: false, type: Boolean },
  },
})
</script>

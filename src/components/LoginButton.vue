<template>
  <div class="flex items-center justify-center">
    <button
      class="btn-primary"
      type="button"
      :disabled="isDisabled"
      @click="$emit('click')"
    >
      はじめる
    </button>
  </div>
</template>
<script lang="ts">
// :disabled="!this.$accessor.auth.ready || !displayName"
import Vue from 'vue'
export default Vue.extend({
  props: {
    isDisabled: { default: false, type: Boolean },
  },
})
</script>

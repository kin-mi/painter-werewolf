<template>
  <div id="content">
    <transition name="page">
      <nuxt class="flex-grow flex-1" />
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  head: {
    bodyAttrs: {
      class: 'body',
    },
  },
})
</script>

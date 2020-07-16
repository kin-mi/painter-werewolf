<template>
  <div v-if="false" class="wrapper">
    <div class="filter-wrapper">
      <p>待機中</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
<style scoped>
.wrapper {
  @apply w-full h-full;
  box-shadow: 1px 1px 20px rgba(255, 255, 255, 0.7) inset;
}
.filter-wrapper {
  @apply w-full h-full flex justify-center items-center;
  @apply bg-paint-gray bg-opacity-50;
}
.filter-wrapper p {
  @apply text-paint-blue font-round select-none;
  font-size: 5rem;
  animation: blink 1.5s ease-in-out infinite alternate;
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}
</style>

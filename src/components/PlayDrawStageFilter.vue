<template>
  <div class="wrapper">
    <div v-if="mode === 'stanby'" class="filter-stanby-wrapper">
      <p>待機中</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'

export type MODE = 'stanby' | 'otherTurn' | 'myTurn' | 'none'
export default Vue.extend({
  props: {
    mode: {
      type: String as PropType<MODE>,
      required: true,
    },
  },
  computed: {
    currentUserName(): string {
      const currentUserId = this.$gm.playground.currentTurn.painter
      return (
        this.$gm.playground?.players.find((e) => {
          return e.id === currentUserId
        })?.playerName || ''
      )
    },
  },
})
</script>
<style scoped>
.wrapper {
  @apply w-full h-full pointer-events-none;
  box-shadow: -3px -3px 10px -3px rgba(0, 0, 0, 0.5) inset,
    3px 3px 10px 3px rgba(255, 255, 255, 0.5) inset;
}
.filter-stanby-wrapper {
  @apply w-full h-full flex justify-center items-center;
  @apply bg-paint-gray bg-opacity-50;
  @apply pointer-events-none;
}
.filter-stanby-wrapper p {
  @apply text-paint-orange font-round select-none;
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

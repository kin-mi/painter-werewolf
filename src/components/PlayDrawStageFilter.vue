<template>
  <div class="wrapper">
    <template v-if="mode === 'stanby'">
      <div v-if="mode === 'stanby'" class="filter-stanby">
        <p>待機中</p>
      </div>
    </template>

    <template v-if="mode === 'myTurn' && $canvas.isDrawing">
      <div is="style">
        @keyframes shadow-effect { 0% { box-shadow: 0 0 0 0
        {{ shadowColor }} inset, 0 0 0 0 {{ shadowColor }} inset; } 100% {
        box-shadow: 0px -42px 40px -40px {{ shadowColor }} inset, 0px 42px 40px
        -40px {{ shadowColor }} inset; } };
      </div>
      <div class="filter-my-drawing" />
    </template>

    <template v-if="mode === 'otherTurn'">
      <div class="filter-other-drawing">
        <p class="w-full">{{ currentUserName }}</p>
        <p class="w-full">がお絵かき中...</p>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'

export type MODE = 'stanby' | 'otherTurn' | 'myTurn' | 'none'
function hex2rgb(hex: string): number[] {
  if (hex.slice(0, 1) === '#') hex = hex.slice(1)
  if (hex.length === 3)
    hex =
      hex.slice(0, 1) +
      hex.slice(0, 1) +
      hex.slice(1, 2) +
      hex.slice(1, 2) +
      hex.slice(2, 3) +
      hex.slice(2, 3)

  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(function (
    str
  ) {
    return parseInt(str, 16)
  })
}

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
        this.$gm.playground.players.find((e) => {
          return e.id === currentUserId
        })?.playerName || ''
      )
    },
    userColor(): string {
      return (
        this.$room.info.playersStatus.find(
          (e) => e.id === this.$accessor.auth.user.id
        )?.color || '#000'
      )
    },
    shadowColor(): string {
      return `rgba(${hex2rgb(this.userColor).join(', ')}, 0.5)`
    },
  },
})
</script>
<style scoped>
.wrapper {
  @apply w-full h-full pointer-events-none leading-none;
  box-shadow: -3px -3px 10px -3px rgba(0, 0, 0, 0.5) inset,
    3px 3px 10px 3px rgba(255, 255, 255, 0.5) inset;
}
.filter-stanby {
  @apply w-full h-full flex justify-center items-center;
  @apply bg-paint-gray bg-opacity-50;
}
.filter-stanby p {
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

.filter-my-drawing {
  @apply w-full h-full;
  @apply pointer-events-none;
  box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.5) inset;
  animation: shadow-effect 1s ease-in-out infinite alternate;
}
/* @keyframes shadow-effect {
  0% {
    box-shadow: 0px -7px 5px -5px rgba(255, 0, 0, 0.5) inset,
      0px 7px 5px -5px rgba(255, 0, 0, 0.5) inset;
  }
  100% {
    box-shadow: 0px -42px 40px -40px rgba(255, 0, 0, 0.5) inset,
      0px 42px 40px -40px rgba(255, 0, 0, 0.5) inset;
  }
} */
.filter-other-drawing {
  @apply w-full h-full flex flex-wrap justify-center items-center;
  @apply bg-paint-gray bg-opacity-50;
}
.filter-other-drawing p {
  @apply text-paint-orange font-round select-none;
  font-size: 5rem;
  animation: blink 1.5s ease-in-out infinite alternate;
}
</style>

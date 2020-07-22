<template>
  <div class="w-full flex flex-wrap justify-center">
    <div
      v-for="user in users"
      :key="user.id"
      class="list-wrapper"
      :class="[
        cardWidth,
        user.id === currentUserId ? 'current-user' : 'border',
      ]"
      :style="{
        'border-color': user.color,
        'background-color': user.color + '40',
      }"
    >
      <p v-if="users.length <= 5" class="w-full mt-1">
        <img
          :src="userIcon(user.icon)"
          class="user-icon"
          :style="{ 'background-color': user.color }"
        />
      </p>
      <p class="user-name">{{ user.playerName }}</p>
      <div v-if="user.status === 'offline'" class="offline-filter">
        <p>OFFLINE</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { RoomUser } from '~/plugins/room'
import { IconFileName } from '~/utils/constant'

export default Vue.extend({
  computed: {
    users(): RoomUser[] {
      if (this.$gm.playground) {
        return this.$gm.playground.players
      } else {
        return this.$room.info.playersStatus.filter(
          (e) => e.status === 'online'
        )
      }
    },
    currentUserId(): string {
      return this.$gm.playground?.currentTurn?.painter || ''
    },
    cardWidth(): string {
      return this.users.length <= 3
        ? 'w-1/4'
        : this.users.length === 4
        ? 'w-1/5'
        : 'w-1/6'
    },
    iconList(): [string, NodeRequire][] {
      return IconFileName.map((e) => {
        return [e, require(`~/assets/images/${e}`)]
      })
    },
  },
  methods: {
    userIcon(iconURL: string): NodeRequire | undefined {
      const icon = this.iconList.find((i) => i[0] === iconURL)
      return icon![1] || undefined
    },
  },
})
</script>
<style scoped>
.list-wrapper {
  @apply relative;
  @apply h-auto mt-1 mr-1 pb-1 bg-white bg-opacity-50 rounded-lg;
  max-width: 10rem;
  min-height: 2.15rem;
}
.list-wrapper:last-of-type {
  @apply mr-0;
}
.user-icon {
  @apply w-6 h-6 mx-auto rounded-full;
}
.user-name {
  @apply w-full mt-1 text-xs leading-3 overflow-hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
@screen sm {
  .user-icon {
    @apply w-8 h-8;
  }
  .user-name {
    @apply text-sm;
  }
}
.current-user {
  @apply border-2;
  animation: katakata 3s ease 0s infinite normal both;
}
@keyframes katakata {
  0% {
    transform: skewY(0deg);
  }
  77% {
    transform: skewY(0deg);
  }
  80% {
    transform: skewY(-5deg);
  }
  83% {
    transform: skewY(5deg);
  }
  86% {
    transform: skewY(0deg);
  }
  to {
    transform: skewY(0deg);
  }
}
.offline-filter {
  @apply absolute top-0 left-0 bottom-0 w-full h-full;
  @apply flex justify-center items-center;
  @apply bg-gray-500 rounded-md opacity-75;
  @apply font-bold text-lg;
}
.offline-filter p {
  @apply transform;
  --transform-rotate: 15deg;
}
</style>

<template>
  <div class="w-full flex flex-wrap justify-center">
    <div
      v-for="user in onlineUsers"
      :key="user.id"
      class="list-wrapper"
      :class="[cardWidth, user.id === currentUserId ? 'border-2' : 'border']"
      :style="{
        'border-color': user.color,
        'background-color': user.color + '40',
      }"
    >
      <p v-if="onlineUsers.length <= 5" class="w-full mt-1">
        <img
          :src="userIcon(user.icon)"
          class="user-icon"
          :style="{ 'background-color': user.color }"
        />
      </p>
      <p class="user-name">{{ user.playerName }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { RoomUser } from '~/plugins/room'
import { IconFileName } from '~/utils/constant'

export default Vue.extend({
  computed: {
    onlineUsers(): RoomUser[] {
      if (this.$gm.playground) {
        return this.$gm.playground.players.filter((e) => e.status === 'online')
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
      return this.onlineUsers.length <= 3
        ? 'w-1/4'
        : this.onlineUsers.length === 4
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
  @apply h-auto mt-1 mr-1 pb-1 bg-white bg-opacity-50 rounded-lg;
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
</style>

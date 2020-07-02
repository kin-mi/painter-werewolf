<template>
  <div class="container">
    <h1 class="title w-full">ロビー</h1>
    <template v-if="!isJoined">
      <div class="w-full flex items-center justify-center">
        <RoomCreate />
      </div>
      <div class="w-full flex items-center justify-center">
        <RoomList />
      </div>
    </template>
    <template v-else>
      <Room />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RoomCreate from '~/components/RoomCreate.vue'
import RoomList from '~/components/RoomList.vue'
import Room from '~/components/Room.vue'
import { User } from '~/store/auth'

export default Vue.extend({
  components: {
    RoomCreate,
    RoomList,
    Room,
  },
  validate({ app }) {
    // 認証状態の監視 （待機 最大1秒）
    const waitReady = (nowSec: number): boolean => {
      if (nowSec > 1000) {
        // time over
        return false
      }
      setTimeout(() => {}, 50)
      if (app.$accessor.auth.isReady) {
        if (app.$accessor.auth.user.id && !app.$accessor.auth.user.playerName) {
          app.$accessor.auth.SET_USER({
            id: app.$accessor.auth.user.id,
            displayName: app.$accessor.auth.user.displayName || '',
            playerName: app.$accessor.auth.user.displayName,
          } as User)
          // already logged in
          return true
        } else if (app.$accessor.auth.user.playerName) {
          // from Login page
          return true
        } else {
          // not logged in
          return false
        }
      }
      // not ready
      return waitReady(nowSec + 50)
    }
    return waitReady(0)
  },
  computed: {
    isJoined(): boolean {
      return !!Object.keys(this.$room.info).length
    },
  },
})
</script>

<style>
.container {
  @apply flex flex-wrap content-start justify-center items-start text-center mx-auto bg-base;
}

.title {
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

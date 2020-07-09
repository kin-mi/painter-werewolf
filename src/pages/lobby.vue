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

export default Vue.extend({
  transition: {
    name: 'test',
    mode: 'out-in',
  },
  components: {
    RoomCreate,
    RoomList,
    Room,
  },
  async validate({ app }) {
    return await app.$accessor.auth
      .asyncAuth()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
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

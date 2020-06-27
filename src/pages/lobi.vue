<template>
  <div class="container">
    <h1 class="title w-full">ロビー</h1>
    <div class="w-full flex items-center justify-center">
      <RoomCreate />
    </div>
    <div class="w-full flex items-center justify-center">
      <RoomList />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RoomCreate from '~/components/RoomCreate.vue'
import RoomList from '~/components/RoomList.vue'

export default Vue.extend({
  components: {
    RoomCreate,
    RoomList,
  },
  validate({ app }) {
    return !!app.$accessor.auth.user.playerName
  },
})
</script>

<style>
.container {
  @apply min-h-screen flex flex-wrap content-start justify-center items-start text-center mx-auto bg-base;
}

.title {
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

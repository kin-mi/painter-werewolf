<template>
  <div class="w-full flex justify-center">
    <div
      v-for="user in onlineUsers"
      :key="user.id"
      class="w-1/3 bg-gray-500 p-px"
    >
      {{ user.playerName }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    onlineUsers() {
      return this.$room.info.playersStatus.filter((e) => e.status === 'online')
    },
  },
})
</script>

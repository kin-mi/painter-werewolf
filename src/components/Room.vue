<template>
  <div>
    <PlayerList />
    <PlayDrawStage class="mt-2" />
    <div class="flex items-center justify-center" style="margin-top: -100px;">
      <button v-if="isOwner" class="btn exit" type="button" @click="closeRoom">
        部屋を閉じる
      </button>
      <button class="btn exit" type="button" @click="exitRoom">
        退出する
      </button>
    </div>
    <div class="flex items-center justify-center mt-2">
      <button v-if="isOwner" class="btn start" type="button" @click="playStart">
        ゲーム開始
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PlayerList from '~/components/PlayerList.vue'
import PlayDrawStage from '~/components/PlayDrawStage.vue'
import { Room, RoomUser } from '~/plugins/room'
export default Vue.extend({
  components: {
    PlayerList,
    PlayDrawStage,
  },
  computed: {
    room(): Room {
      return this.$room.info
    },
    onlineUsers(): RoomUser[] {
      return this.room.playersStatus.filter((e) => e.status === 'online')
    },
    watchUsers(): RoomUser[] {
      return this.room.watchers.filter((e) => e.status === 'online')
    },
    isOwner(): boolean {
      return (
        this.onlineUsers.findIndex((e) => {
          return e.id === this.$accessor.auth.user.id
        }) === 0
      )
    },
  },
  watch: {
    async room(n: Room | undefined, _o: Room | undefined) {
      // オーナーによって部屋が閉じられたら強制退出
      if (n && n.status === 'close') this.$room.info = {} as Room
      // ゲーム開始
      if (n && n.status === 'play') await this.$router.push('play')
    },
  },
  mounted() {
    this.$room.attachRoom(this.room.id)
  },
  methods: {
    async closeRoom() {
      await this.$room.close(this.room.id)
    },
    async exitRoom() {
      if (this.onlineUsers.length === 1) await this.closeRoom()
      else await this.$room.exit(this.room.id)
    },
    async playStart() {
      await this.$gm.start(this.room.id)
      await this.$router.push('play')
    },
  },
})
</script>
<style scoped>
.btn {
  @apply relative;
  @apply inline-flex items-center justify-center;
  @apply w-32;
  @apply m-1;
  @apply rounded-full;
  @apply tracking-widest;
  box-shadow: 1px 1px 3px rgba(255, 255, 255, 0.5) inset;
}
.btn:hover:not(:disabled),
.btn:focus:not(:disabled) {
  @apply transition-colors duration-300;
  @apply outline-none;
  @apply text-base-light;
}
.btn:disabled {
  @apply cursor-default;
  @apply text-base-light;
  @apply border border-gray-500;
  @apply bg-paint-gray;
}

.exit {
  @apply border border-paint-blue;
  @apply text-paint-blue;
  @apply bg-paint-blue;
  --bg-opacity: 0.15;
}
.exit:hover:not(:disabled),
.exit:focus:not(:disabled) {
  @apply bg-paint-blue;
}

.start {
  @apply border border-paint-red;
  @apply text-paint-red;
  @apply bg-paint-red;
  --bg-opacity: 0.15;
}
.start:hover:not(:disabled),
.start:focus:not(:disabled) {
  @apply bg-paint-red;
}
</style>

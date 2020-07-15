<template>
  <div>
    <PlayerList />
    <h2>{{ room.message }}</h2>
    <h3>待機中のユーザー：{{ onlineUsers.length }}人</h3>
    <ol class="list-none">
      <li
        v-for="user in onlineUsers"
        :key="user.id"
        class="font-bold text-gr"
        :style="{ color: user.color }"
      >
        {{ user.playerName }}
      </li>
    </ol>
    <div class="flex items-center justify-center">
      <button
        v-if="isOwner"
        style="width: 104px; height: 36px; font-size: 13px;"
        class="hover:opacity-75 btn-primary mr-2"
        type="button"
        @click="closeRoom"
      >
        部屋を閉じる
      </button>
      <button
        style="width: 104px; height: 36px; font-size: 13px;"
        class="hover:opacity-75 btn-primary"
        type="button"
        @click="exitRoom"
      >
        退出する
      </button>
    </div>
    <div class="flex items-center justify-center mt-2">
      <button
        v-if="isOwner"
        style="width: 104px; height: 36px; font-size: 13px;"
        class="hover:opacity-75 btn-primary"
        type="button"
        @click="playStart"
      >
        ゲーム開始
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PlayerList from '~/components/PlayerList.vue'
import { Room, RoomUser } from '~/plugins/room'
export default Vue.extend({
  components: {
    PlayerList,
  },
  computed: {
    room(): Room {
      return this.$room.info
    },
    onlineUsers(): RoomUser[] {
      return this.room.playersStatus.filter((e) => e.status === 'online')
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
  beforeDestroy() {
    this.$room.detachRoom()
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

<template>
  <div class="flex flex-wrap items-center justify-center">
    <h3 class="list-header">募集一覧</h3>
    <div v-if="list.length < 0" class="nothing">
      <p>現在募集はありません</p>
    </div>
    <div v-for="room in list" :key="room.id" class="card-wrapper">
      <div class="card">
        <div class="card-title">
          <p class="text-red-800 text-xs" style="line-height: 0.9rem;">
            お題
          </p>
          <p class="text-red-800 text-lg font-bold">{{ room.theme }}</p>
        </div>
        <div class="card-details">
          <p>
            {{ room.round }}T / {{ room.limitPlayers }}人まで /
            <eye-icon :size="20" :class="room.watch ? '' : 'text-gray-500'" />
            /
            <message-text
              :size="20"
              :class="room.watch ? '' : 'text-gray-500'"
            />
          </p>
        </div>
        <div class="card-details">
          <p>
            オーナー : {{ filterOnlineUsers(room.playersStatus)[0].playerName }}
          </p>
        </div>
        <div class="card-details">
          <p>
            {{ room.status === 'wait' ? '待機中' : '対戦中' }}
          </p>
        </div>
        <div class="card-details">
          <p>
            観戦 : 10 人 / プレイヤー : 10 人
          </p>
        </div>
        <div class="card-message">
          <p class="text-paint-brown text-xs">メッセージ</p>
          <p class="text-paint-brown text-lg">{{ room.message || '&nbsp;' }}</p>
        </div>
        <div class="card-btn">
          <button class="btn-watch" type="button" :disabled="!room.watch">
            観戦する
          </button>
          <button
            class="btn-join"
            type="button"
            :disabled="
              filterOnlineUsers(room.playersStatus).length >= room.limitPlayers
            "
            @click="join(room.id)"
          >
            参加する
          </button>
        </div>
      </div>
      <div class="tape" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Room, RoomUser } from '~/plugins/room'

export default Vue.extend({
  computed: {
    list(): Room[] {
      return this.$room.list
    },
  },
  mounted() {
    this.$room.attachList()
  },
  beforeDestroy() {
    this.$room.detachList()
  },
  methods: {
    async join(roomId: string) {
      await this.$room.join(roomId)
    },
    filterOnlineUsers(users: RoomUser[]) {
      return users.filter((e) => e.status === 'online')
    },
  },
})
</script>
<style scoped>
.list-header {
  @apply w-full;
  @apply my-3;
  @apply tracking-widest;
  @apply text-xl;
  @apply font-round font-bold;
  @apply text-paint-brown;
}
@screen sm {
  .list-header {
    @apply text-2xl;
  }
}
@screen md {
  .list-header {
    @apply text-3xl;
  }
}
.card-wrapper {
  @apply relative flex flex-wrap flex-col w-full py-4;
}
.card {
  @apply flex-1 w-11/12 max-w-sm h-auto mx-auto bg-base-light rounded-sm;
  @apply font-round;
  box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.4);
}
.card-title {
  @apply w-auto h-auto mt-3 mb-1 ml-5 mr-1 pt-2 bg-red-300;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
}
.card-details {
  @apply w-auto h-auto mx-2 border-b border-dashed border-gray-400 text-paint-brown text-sm;
}
.material-design-icon svg {
  @apply inline-block;
}
.card-message {
  @apply w-auto h-auto my-1 ml-1 mr-5 pb-1;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
}
.card-btn {
  @apply flex w-full h-auto p-1;
}
.btn-watch {
  @apply relative;
  @apply inline-flex items-center justify-center;
  @apply w-1/2;
  @apply m-1;
  @apply rounded-full;
  @apply border border-paint-bule;
  @apply text-paint-bule;
  @apply tracking-widest;
}

.btn-join {
  @apply inline-flex items-center justify-center;
  @apply w-1/2;
  @apply m-1;
  @apply rounded-full;
  @apply border border-paint-red;
  @apply text-paint-red;
  @apply tracking-widest;
}

.tape {
  @apply absolute;
  top: 0;
  left: 44%;
  @apply transform;
  --transform-rotate: -15deg;
  @apply w-16 h-8 mx-auto bg-paint-red bg-opacity-50;
  background-image: linear-gradient(
    -90deg,
    theme('colors.paint.red') 40%,
    transparent 40%,
    transparent
  );
  background-size: 14px 14px;
  @apply border-r-2 border-l-2 border-dotted border-paint-red;
}
.nothing {
  @apply w-full;
  @apply my-3;
  @apply tracking-widest;
  @apply text-lg;
  @apply font-round font-bold;
  @apply text-paint-brown;
}
</style>

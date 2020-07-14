<template>
  <div class="flex flex-wrap items-center justify-center">
    <h3 class="list-header">募集一覧</h3>
    <div v-if="list.length === 0" class="nothing">
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
            <eye-icon :size="20" :class="room.watch ? '' : 'text-gray-400'" />
            /
            <message-text
              :size="20"
              :class="room.chat ? '' : 'text-gray-400'"
              style="-webkit-text-stroke-width: 5px;"
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
          <button class="btn watch" type="button" :disabled="!room.watch">
            観戦する
          </button>
          <button
            class="btn join"
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
  @apply mt-3 mb-5;
  @apply tracking-widest;
  @apply text-2xl;
  @apply font-round font-bold;
  @apply text-paint-brown;
}
@screen sm {
  .list-header {
    @apply text-3xl;
  }
}

.card-wrapper {
  @apply relative flex flex-wrap flex-col w-full py-4;
}
.card {
  @apply flex-1 w-11/12 max-w-sm h-auto mx-auto rounded-sm;
  background: #f8f0d7;
  @apply border-l-4 border-r-4 border-dotted border-black;
  --border-opacity: 0.1;
  @apply font-round;
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.4);
}
.card-title {
  @apply w-auto h-auto mt-5 mb-1 pt-3 bg-red-300;
  /* box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3); */
}
.card-details {
  @apply w-auto h-auto mx-2 border-b border-dashed border-gray-400 text-paint-brown text-sm;
}
.material-design-icon svg {
  @apply inline-block;
}
.card-message {
  @apply w-auto h-auto my-1 mx-2 pb-1 border border-paint-brown rounded-md;
  /* box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3); */
}
.card-btn {
  @apply flex w-full h-auto p-1;
}
.btn {
  @apply relative;
  @apply inline-flex items-center justify-center;
  @apply w-1/2;
  @apply m-1;
  @apply rounded-full;
  @apply tracking-widest;
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

.watch {
  @apply border border-paint-blue;
  @apply text-paint-blue;
}
.watch:hover:not(:disabled),
.watch:focus:not(:disabled) {
  @apply bg-paint-blue;
}

.join {
  @apply border border-paint-red;
  @apply text-paint-red;
}
.join:hover:not(:disabled),
.join:focus:not(:disabled) {
  @apply bg-paint-red;
}

.tape {
  @apply absolute;
  top: 0;
  left: 50%;
  @apply transform;
  --transform-translate-x: -4rem;
  --transform-rotate: -10deg;
  @apply w-32 h-10 mx-auto;
  background-image: linear-gradient(
    -45deg,
    rgba(49, 130, 206, 0.4) 25%,
    rgba(255, 255, 255, 0.4) 25%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(49, 130, 206, 0.4) 50%,
    rgba(49, 130, 206, 0.4) 75%,
    rgba(255, 255, 255, 0.4) 75%,
    rgba(255, 255, 255, 0.4) 100%
  );
  background-size: 20px 20px;
  border-left: 2px dotted rgba(0, 0, 0, 0.1);
  border-right: 2px dotted rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  @apply text-blue-600;
}
.nothing {
  @apply w-4/5;
  @apply my-3 py-1;
  @apply bg-white bg-opacity-50;
  @apply rounded-sm;
  @apply text-lg;
  @apply font-round font-bold;
  @apply text-paint-brown;
  @apply tracking-widest;
}
</style>

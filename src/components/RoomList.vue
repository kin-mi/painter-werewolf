<template>
  <div class="flex flex-wrap items-center justify-center">
    <h3 class="list-header">募集一覧</h3>

    <div v-for="room in list" :key="room.id" class="card-wrapper">
      <div class="card-left">
        <p class="theme-badge">
          お題
        </p>
        <p class="theme">{{ room.theme }}</p>
      </div>
      <div class="card-center">
        <div class="card-center-top">
          <p>{{ room.message }}</p>
        </div>
        <div class="card-center-bottom">
          <p>
            {{ room.round }}T / {{ room.limitPlayers }}人まで /
            <eye-icon :size="12" /> /
            <message-text :size="12" />
          </p>
        </div>
      </div>
      <div class="card-right">
        <button class="btn-join btn-bule" type="button" :disabled="!room.watch">
          観戦
        </button>
        <button
          class="btn-join btn-red"
          type="button"
          :disabled="
            filterOnlineUsers(room.playersStatus).length >= room.limitPlayers
          "
          @click="join(room.id)"
        >
          参加
        </button>
      </div>
    </div>
    <!-- <p class="text-lg">部屋一覧</p>
    <table class="table-fixed border border-gray-600">
      <thead>
        <tr>
          <th class="px-2 py-1">メッセージ</th>
          <th class="px-2 py-1">テーマ</th>
          <th class="px-2 py-1">ターン数</th>
          <th class="px-2 py-1">最大人数</th>
          <th class="px-2 py-1">観戦許可</th>
          <th class="px-2 py-1">チャット</th>
          <th class="px-2 py-1">オーナー</th>
          <th class="px-2 py-1">ステータス</th>
          <th class="px-2 py-1">観戦</th>
          <th class="px-2 py-1">参加</th>
        </tr>
      </thead>
      <tbody v-if="list.length > 0">
        <tr v-for="room in list" :key="room.id">
          <td class="px-2 py-1">
            {{ room.message }}
          </td>
          <td class="px-2 py-1">{{ room.theme }}</td>
          <td class="px-2 py-1">{{ room.round }}</td>
          <td class="px-2 py-1">{{ room.limitPlayers }}</td>
          <td class="px-2 py-1">{{ room.watch ? '○' : '×' }}</td>
          <td class="px-2 py-1">{{ room.chat ? '○' : '×' }}</td>
          <td class="px-2 py-1">
            {{ filterOnlineUsers(room.playersStatus)[0].playerName }}
          </td>
          <td class="px-2 py-1">
            {{ room.status === 'wait' ? '待機中' : '対戦中' }}
          </td>
          <td class="px-2 py-1">
            <button
              style="width: 52px; height: 13px; font-size: 6px;"
              class="hover:opacity-75 btn-primary"
              type="button"
              :disabled="!room.watch"
            >
              観戦する
            </button>
          </td>
          <td class="px-2 py-1">
            <button
              style="width: 52px; height: 13px; font-size: 6px;"
              class="hover:opacity-75 btn-primary"
              type="button"
              :disabled="
                filterOnlineUsers(room.playersStatus).length >=
                room.limitPlayers
              "
              @click="join(room.id)"
            >
              参加する
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="px-2 py-1 cols text-center" colspan="10">
            <p>部屋はありません</p>
          </td>
        </tr>
      </tbody>
    </table> -->
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
  @apply mt-3;
  @apply tracking-widest;
  @apply text-2xl;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
}
.card-wrapper {
  @apply flex w-11/12 h-12 mt-3 bg-base-light rounded-sm;
  box-shadow: 3px 3px 5px 3px rgba(0, 0, 0, 0.4);
}
.card-left {
  @apply flex flex-col flex-none h-full p-1 bg-paint-orange;
  width: 30%;
}

.card-center {
  @apply flex flex-col w-full h-full text-left;
}
.card-center-top {
  @apply flex-1 w-full px-1 border-b border-gray-400;
}
.card-center-bottom {
  @apply flex-1 w-full px-1;
  font-size: 8px;
}
.theme-badge {
  @apply w-full text-paint-brown font-bold;
  font-size: 10px;
  line-height: 0.9rem;
}
.theme {
  @apply w-auto max-w-full mx-auto text-xs text-paint-black;
  line-height: 0.9rem;
}
.material-design-icon svg {
  @apply inline-block;
}

.card-right {
  @apply flex flex-none w-1/5 h-full;
}
.btn-join {
  @apply relative;
  @apply w-1/2;
  @apply m-1;
  @apply inline-flex items-center justify-center;
  @apply rounded-full;
  @apply outline-none;
  @apply no-underline;
  @apply text-base-light;
  @apply border border-dashed border-base-darkness;
  @apply transition duration-300 ease-in-out;
  font-size: 6px;
  line-height: 0.9rem;
}

.btn-join:hover:not(:disabled) {
  @apply border-dotted;
}
.btn-join:focus {
  @apply outline-none;
  box-shadow: 0px 0px 0px 2px theme('colors.paint.green');
}
.btn-join.btn-red {
  @apply bg-paint-leather-red;
}
.btn-join.btn-bule {
  @apply bg-paint-bule;
}
</style>

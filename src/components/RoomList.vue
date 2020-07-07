<template>
  <div class="mt-2 px-2 pb-2 pt-1 text-left rounded-lg overflow-scroll">
    <p class="text-lg">部屋一覧</p>
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
    </table>
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

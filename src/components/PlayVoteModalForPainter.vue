<template>
  <!--Modal-->
  <div
    v-if="!voted"
    class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
  >
    <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" />

    <div
      class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
    >
      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="modal-content py-4 text-left px-6">
        <!--Title-->
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold">人狼を1人選んでください</p>
        </div>

        <!--Body-->
        <form class="w-full max-w-sm flex flex-wrap">
          <template v-for="user in targetUsers">
            <input
              :id="user.id"
              :key="`input${user.id}`"
              v-model="voteResult"
              type="radio"
              :value="user.id"
              class="w-1/6 mt-2"
            />
            <label
              :key="`label${user.id}`"
              :for="user.id"
              :style="{ color: user.color }"
              class="w-5/6 mt-2"
              >{{ user.playerName }}</label
            >
          </template>
        </form>
        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button
            class="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
            @click="vote"
          >
            投票する
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { PlayUser } from '~/plugins/gameManager'
export default Vue.extend({
  data() {
    return {
      voteResult: this.$gm.playground?.players.filter((e) => {
        return e.id !== this.$accessor.auth.user.id
      })[0].id,
      voted: false,
    }
  },
  computed: {
    targetUsers(): PlayUser[] {
      return (
        this.$gm.playground?.players.filter((e) => {
          return e.id !== this.$accessor.auth.user.id
        }) || []
      )
    },
  },
  methods: {
    async vote() {
      if (!this.voteResult) return
      await this.$gm.acceptVote(this.$room.info.id, this.voteResult)
      this.voted = true
    },
  },
})
</script>

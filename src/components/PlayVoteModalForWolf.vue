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
          <p class="text-2xl font-bold">お題を入力してください</p>
        </div>

        <!--Body-->
        <input v-model="voteResult" class="border" />
        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button
            class="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
            @click="vote"
          >
            送信する
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      voteResult: '',
      voted: false,
    }
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

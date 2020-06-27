<template>
  <div>
    <div class="flex items-center justify-center">
      <button
        style="width: 104px; height: 36px; font-size: 13px;"
        class="hover:opacity-75 btn-primary"
        type="button"
        :disabled="!this.$accessor.auth.ready"
        @click="modalActivate"
      >
        部屋を作成する
      </button>
    </div>

    <!--Modal-->
    <div
      class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
      :class="modalActive ? '' : 'opacity-0 pointer-events-none '"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        @click="modalClose"
      />

      <div
        class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold">部屋を作成</p>
            <div class="modal-close cursor-pointer z-50" @click="modalClose">
              <svg
                class="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                ></path>
              </svg>
            </div>
          </div>

          <!--Body-->
          <form class="w-full max-w-sm flex flex-col">
            <label for="message">
              メッセージ
            </label>
            <input
              id="message"
              v-model="roomConfig.message"
              class="border-b text-right"
              type="text"
              min="1"
              max="10"
            />
            <label for="turn">
              ターン数
            </label>
            <input
              id="trun"
              v-model="roomConfig.turn"
              class="border-b text-right"
              type="number"
              min="1"
              max="10"
            />
            <label for="limitPlayers">
              最大人数
            </label>
            <input
              id="limitPlayers"
              v-model="roomConfig.limitPlayers"
              class="border-b text-right"
              type="number"
              min="3"
              max="10"
            />
            <label for="watch">
              観戦許可
            </label>
            <input
              id="watch"
              v-model="roomConfig.watch"
              class="border-b text-right"
              type="checkbox"
            />
            <label for="chat">
              チャット有無
            </label>
            <input
              id="chat"
              v-model="roomConfig.chat"
              class="border-b text-right"
              type="checkbox"
            />
          </form>

          <!--Footer-->
          <div class="flex justify-end pt-2">
            <button
              class="px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400"
              @click="createRoom"
            >
              作成する
            </button>
          </div>
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
      modalActive: false,
      roomConfig: {
        message: '',
        turn: 2,
        limitPlayers: 5,
        watch: true,
        chat: true,
      },
    }
  },
  mounted() {
    this.$room.attachList()
  },
  beforeDestroy() {
    this.$room.detachList()
  },
  methods: {
    modalActivate() {
      this.modalActive = true
    },
    modalClose() {
      this.modalActive = false
    },
    async createRoom() {
      await this.$room.create({ ...this.roomConfig })
      this.modalClose()
    },
  },
})
</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
.modal-active {
  overflow-x: hidden;
  overflow-y: visible !important;
}
.toggle__dot {
  top: -0.25rem;
  left: -0.25rem;
  transition: all 0.3s ease-in-out;
}

input:checked ~ .toggle__dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>

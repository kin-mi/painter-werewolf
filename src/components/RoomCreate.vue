<template>
  <div class="flex flex-wrap items-center justify-center">
    <div class="create-room-card">
      <button
        class="btn-add"
        type="button"
        :disabled="!this.$accessor.auth.ready"
        @click="modalActivate"
      >
        <plus-icon />
      </button>
      <p class="text-paint-leather-red text-lg mt-3">
        部屋を作成する
      </p>
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
            <label for="category">
              お題カテゴリ
            </label>
            <select
              id="category"
              v-model="roomConfig.category"
              class="border-b text-right"
            >
              <option
                v-for="(category, index) in categoreis"
                :key="`${category}${index}`"
                >{{ category }}</option
              >
            </select>
            <label for="theme">
              お題テーマ
            </label>
            <select
              id="theme"
              v-model="roomConfig.theme"
              class="border-b text-right"
            >
              <option
                v-for="(theme, index) in themes"
                :key="`${theme}${index}`"
                >{{ theme }}</option
              >
            </select>
            <label for="turn">
              ターン数
            </label>
            <input
              id="trun"
              v-model="roomConfig.round"
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
            <label for="message">
              募集メッセージ
            </label>
            <input
              id="message"
              v-model="roomConfig.message"
              class="border-b text-right"
              type="text"
              min="1"
              max="10"
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
import { Categories, Themes, ThemeMap } from '~/utils/theme'

export default Vue.extend({
  data() {
    return {
      modalActive: false,
      roomConfig: {
        category: '色' as Categories,
        theme: '赤いもの' as Themes<Categories>,
        message: '',
        round: 2,
        limitPlayers: 5,
        watch: true,
        chat: true,
      },
    }
  },
  computed: {
    categoreis(): string[] {
      return Object.keys(ThemeMap)
    },
    themes(): Themes<Categories>[] {
      return (ThemeMap as ThemeMap)[this.roomConfig.category].map(
        (e) => e.theme as Themes<Categories>
      )
    },
  },
  watch: {
    'roomConfig.category'(n, o) {
      if (n !== o) this.roomConfig.theme = this.themes[0]
    },
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

<style scoped>
.create-room-card {
  @apply flex flex-col flex-wrap items-center justify-center;
  @apply pt-5 pb-2 px-3;
  @apply rounded-md;
  @apply bg-base;
  box-shadow: 3px 3px 5px 3px rgba(0, 0, 0, 0.4);
}
.btn-add {
  @apply relative;
  @apply bg-paint-leather-red;
  box-shadow: 0px 0px 0px 5px theme('colors.paint.leather-red'),
    5px 5px 10px 3px rgb(0, 0, 0, 0.7);
  @apply inline-flex items-center justify-center;
  @apply rounded-full;
  @apply outline-none;
  @apply no-underline;
  @apply p-4;
  @apply text-base-light;
  @apply border border-dashed border-base-darkness;
  @apply transition duration-300 ease-in-out;
}

.btn-add:hover:not(:disabled) {
  @apply border-dotted;
}
.btn-add:focus {
  @apply outline-none;
  box-shadow: 0px 0px 0px 5px theme('colors.paint.leather-red'),
    5px 5px 5px 3px rgb(0, 0, 0, 0.7),
    0px 0px 0px 7px theme('colors.paint.green');
}

.material-design-icon {
  @apply absolute;
  @apply top-0 left-0 right-0 bottom-0;
  @apply flex justify-center items-center;
  @apply m-auto;
  @apply w-full h-full;
}

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

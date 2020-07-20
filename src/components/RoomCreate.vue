<template>
  <div class="flex flex-wrap items-center justify-center">
    <div class="create-room-card">
      <div class="btn-wrapper">
        <div class="btn-label"><plus-icon /></div>
        <button
          class="btn-add"
          type="button"
          :disabled="!this.$accessor.auth.ready"
          @click="modalActivate"
        >
          募集する
        </button>
      </div>
    </div>

    <!--Modal-->
    <transition name="modal">
      <div v-if="modalActive" class="modal">
        <div class="modal-overlay" @click="modalClose" />

        <div class="modal-container">
          <!-- Add margin if you want to see some of the overlay behind the modal-->
          <div class="modal-content">
            <!--Title-->
            <div class="modal-title">
              <p>ゲーム設定</p>
              <div class="modal-close" @click="modalClose">
                <svg
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
            <form class="modal-body" autocomplete="off">
              <label for="category" class="modal-form-label">
                お題カテゴリ
              </label>
              <select
                id="category"
                v-model="roomConfig.category"
                class="modal-form-part"
              >
                <option
                  v-for="(category, index) in categoreis"
                  :key="`${category}${index}`"
                  >{{ category }}</option
                >
              </select>
              <label for="theme" class="modal-form-label">
                お題テーマ
              </label>
              <select
                id="theme"
                v-model="roomConfig.theme"
                class="modal-form-part"
              >
                <option
                  v-for="(theme, index) in themes"
                  :key="`${theme}${index}`"
                  >{{ theme }}</option
                >
              </select>
              <label for="turn" class="modal-form-label">
                ターン数
              </label>
              <input
                id="turn"
                v-model="roomConfig.round"
                class="modal-form-part"
                type="number"
                min="1"
                max="10"
              />
              <label for="limitPlayers" class="modal-form-label">
                最大人数
              </label>
              <input
                id="limitPlayers"
                v-model="roomConfig.limitPlayers"
                class="modal-form-part"
                type="number"
                min="3"
                max="10"
              />
              <label for="watch" class="modal-form-label">
                観戦許可
              </label>
              <input
                id="watch"
                v-model="roomConfig.watch"
                class="modal-form-part"
                type="checkbox"
              />
              <label for="chat" class="modal-form-label">
                チャット有無
              </label>
              <input
                id="chat"
                v-model="roomConfig.chat"
                class="modal-form-part"
                type="checkbox"
              />
              <label for="message" class="modal-form-label">
                募集メッセージ
              </label>
              <input
                id="message"
                v-model="roomConfig.message"
                class="modal-form-part"
                type="text"
              />
            </form>

            <!--Footer-->
            <div class="flex justify-center mt-3">
              <button class="btn-primary" @click="createRoom">
                募集する
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
  @apply w-full flex content-center justify-center;
}
.btn-wrapper {
  @apply flex w-auto h-12;
}
.btn-label {
  @apply w-6 py-2;
  @apply rounded-l-sm;
  @apply bg-red-300;
  @apply text-red-800;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
}
.btn-add {
  @apply inline-flex items-center justify-center;
  @apply px-4 py-2;
  @apply rounded-r-md;
  @apply outline-none;
  @apply no-underline;
  @apply bg-base-light;
  @apply text-red-800 text-lg;
  @apply font-round;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
}

.btn-wrapper:hover {
  @apply transition-all duration-300 transform;
  --transform-rotate: -2deg;
}
.btn-add:hover {
  @apply font-bold;
}
.btn-add:focus {
  @apply outline-none;
  @apply font-bold;
}

.modal {
  @apply z-20;
  @apply fixed w-full h-full top-0 left-0;
  @apply flex items-center justify-center;
  @apply overflow-x-hidden overflow-y-visible;
  transition: opacity 0.25s ease;
}

.modal-overlay {
  @apply absolute w-full h-full;
  @apply bg-gray-900 opacity-50;
}
.modal-container {
  @apply z-30;
  @apply w-11/12 max-w-sm mx-auto;
  @apply bg-base-light rounded shadow-lg overflow-y-auto;
}

.modal-content {
  @apply py-4 text-left px-6;
}
.modal-title {
  @apply flex justify-between items-center pb-3;
}
.modal-title p {
  @apply text-2xl font-bold text-paint-brown;
  background: linear-gradient(transparent 80%, #c6999f 80%);
}
.modal-close {
  @apply cursor-pointer z-30;
}
.modal-close svg {
  @apply fill-current text-black;
}
.modal-body {
  @apply w-full max-w-sm flex flex-col;
}

.modal-form-label {
  @apply pt-2 text-sm text-paint-brown;
}
.modal-form-label[for='message'] {
  @apply text-red-800;
}

.modal-form-part {
  @apply w-56;
  @apply px-2 py-1;
  @apply border-b border-paint-brown rounded-t-sm;
  @apply text-left text-paint-brown font-bold;
  @apply bg-base-dark bg-opacity-50;
}
.modal-form-part:focus {
  @apply outline-none;
  box-shadow: 0 0 0 3px rgba(198, 153, 159, 0.5);
}

.modal-form-part[type='number'] {
  @apply w-12;
}
.modal-form-part[type='checkbox'] {
  @apply w-auto;
}
.modal-form-part#message {
  @apply w-full outline-none text-red-900 bg-opacity-25;
  background-color: rgba(198, 153, 159, var(--bg-opacity));
}
</style>

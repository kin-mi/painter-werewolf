<template>
  <!--Modal-->
  <div v-if="modalActive" class="modal">
    <div class="modal-overlay" />
    <div class="modal-container">
      <div class="modal-content">
        <!--Start-->
        <div class="modal-start">
          <div>
            <p>結果発表</p>
          </div>
        </div>

        <!--Reult-->
        <div class="modal-result">
          <template
            v-if="
              !!$gm.playground ? $gm.playground.result === 'painter' : false
            "
          >
            <div class="header win-painter">
              <p>画家の勝利</p>
            </div>
          </template>
          <template v-else>
            <div class="header win-werewolf">
              <p>人狼の勝利</p>
            </div>
          </template>

          <!-- お題 -->
          <div class="theme">
            <p>お題「{{ $gm.playground.answer || '' }}」</p>
          </div>

          <!-- 人狼発表 -->
          <div class="werewolf">
            <p class="font-bold">人狼</p>
            <div
              class="user-card"
              :style="{
                'border-color': werewolf.color,
                'background-color': werewolf.color + '40',
              }"
            >
              <p class="w-full mt-1">
                <img
                  :src="userIcon(werewolf.icon)"
                  class="user-icon"
                  :style="{ 'background-color': werewolf.color }"
                />
              </p>
              <p class="user-name">{{ werewolf.playerName }}</p>
            </div>
            <p>回答「{{ werewolfAnswer }}」</p>
          </div>

          <!-- 投票結果 -->
          <div class="vote-result">
            <p class="w-full font-bold">投票内訳</p>
            <div
              v-for="voteResult in painterAnswer"
              :key="voteResult.id"
              class="vote-list"
            >
              <div class="vote-list-box">
                <div
                  class="user-card"
                  :style="{
                    'border-color': voteResult.color,
                    'background-color': voteResult.color + '40',
                  }"
                >
                  <p class="w-full mt-1">
                    <img
                      :src="userIcon(voteResult.icon)"
                      class="user-icon"
                      :style="{ 'background-color': voteResult.color }"
                    />
                  </p>
                  <p class="user-name">{{ voteResult.playerName }}</p>
                </div>
              </div>
              <div class="vote-list-box">
                <transfer-right :size="40" />
              </div>
              <div class="vote-list-box">
                <div
                  class="user-card"
                  :style="{
                    'border-color': voteResult.target.color,
                    'background-color': voteResult.target.color + '40',
                  }"
                >
                  <p class="w-full mt-1">
                    <img
                      :src="userIcon(voteResult.target.icon)"
                      class="user-icon"
                      :style="{ 'background-color': voteResult.target.color }"
                    />
                  </p>
                  <p class="user-name">{{ voteResult.target.playerName }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full flex justify-center mt-5 mb-2">
            <button
              class="btn-close"
              type="button"
              @click="modalActive = false"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { IconFileName } from '~/utils/constant'
import { PlayUser } from '~/plugins/gameManager'

export default Vue.extend({
  data() {
    return {
      modalActive: true,
    }
  },
  computed: {
    iconList(): [string, NodeRequire][] {
      return IconFileName.map((e) => {
        return [e, require(`~/assets/images/${e}`)]
      })
    },
    werewolf(): PlayUser {
      return this.$gm.playground.players.find(
        (e) => e.id === this.$gm.playground.werewolf
      )!
    },
    werewolfAnswer(): string {
      return this.$gm.playground.votes.find(
        (e) => e.id === this.$gm.playground.werewolf
      )!.voteResult
    },
    painterAnswer(): any[] {
      const votes = this.$gm.playground.votes.filter(
        (e) => e.id !== this.$gm.playground.werewolf
      )
      return votes.map((e) => {
        return {
          ...e,
          ...this.$gm.playground.players.find((p) => p.id === e.id)!,
          target: this.$gm.playground.players.find(
            (p) => p.id === e.voteResult
          ),
        }
      })
    },
  },
  methods: {
    userIcon(iconURL: string): NodeRequire | undefined {
      const icon = this.iconList.find((i) => i[0] === iconURL)
      return icon![1] || undefined
    },
  },
})
</script>
<style scoped>
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
  @apply mx-auto;
  @apply bg-base-light;
  @apply border-2 border-paint-brown rounded;
  @apply shadow-lg;
  @apply overflow-y-auto;
  animation: zoomIn 0.5s ease 0s 1 normal forwards;
}

.modal-content {
  @apply relative w-full h-full py-4 text-center px-6;
}
.modal-start {
  @apply absolute top-0 left-0 right-0;
  @apply w-full h-full flex justify-center items-center;
  animation: fade-out 0.5s ease 2s 1 normal both;
}
.modal-start p {
  @apply text-5xl font-bold font-round tracking-widest text-paint-leather-red;
  --text-opacity: 100;
  animation: text-draw-wait 0.5s ease 0s 1 normal;
}
.modal-result {
  @apply absolute top-0 left-0 right-0;
  @apply w-full h-full flex flex-col justify-start items-center;
  animation: fade-in 0.1s ease-out 3s 1 normal both;
}
.modal-result > .header {
  @apply mt-2 px-5 py-2;
  @apply text-4xl font-bold font-round tracking-widest;
  @apply rounded-full;
  --text-opacity: 100;
  line-height: 1.2;
  @apply bg-paint-leather-red text-white;
}
.modal-result > .header.win-painter {
  @apply bg-paint-leather-red text-white;
}
.modal-result > .header.win-werewolf {
  @apply bg-paint-black text-white;
}

.modal-result > .werewolf {
  width: 90%;
  @apply mt-2 pt-2 pb-5;
  @apply border-b border-gray-600;
}

.modal-result > .vote-result {
  @apply flex flex-wrap;
  width: 90%;
  @apply mt-2 pt-2 pb-5;
  @apply border-b border-gray-600;
}
.vote-list {
  @apply flex flex-wrap;
  @apply w-full;
}
.vote-list-box {
  @apply flex justify-center items-center;
  @apply w-1/3;
}

.user-card {
  @apply w-full h-auto mt-1 mx-auto pb-1 bg-white bg-opacity-50 rounded-lg;
  @apply border;
  max-width: 5rem;
  min-height: 2.15rem;
}
.user-icon {
  @apply w-6 h-6 mx-auto rounded-full;
}
.user-name {
  @apply w-full mt-1 text-xs leading-3 overflow-hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.btn-close {
  @apply relative;
  @apply inline-flex items-center justify-center;
  @apply w-32;
  @apply m-1;
  @apply rounded-full;
  @apply tracking-widest;
  box-shadow: 1px 1px 3px rgba(255, 255, 255, 0.5) inset;
  @apply border border-paint-red;
  @apply text-paint-red;
  @apply bg-paint-red;
  --bg-opacity: 0.15;
}
.btn-close:hover:not(:disabled),
.btn-close:focus:not(:disabled) {
  @apply transition-colors duration-300;
  @apply outline-none;
  @apply text-base-light;
  @apply bg-paint-red;
}

.modal-body {
  @apply w-full max-w-sm flex flex-wrap;
}

.input-wrapper {
  @apply w-full;
}

.modal-form-label {
  @apply w-9/12 pt-2 text-lg;
}
.modal-form-label[for='message'] {
  @apply text-red-800;
}

.modal-form-part {
  @apply w-2/12 h-auto;
  @apply pt-2;
  @apply border-b border-paint-brown rounded-t-sm;
  @apply text-left text-paint-brown font-bold;
  @apply bg-base-dark bg-opacity-50;
}
.modal-form-part:focus {
  @apply outline-none;
  box-shadow: 0 0 0 3px rgba(198, 153, 159, 0.5);
}

@keyframes zoomIn {
  0% {
    width: 0;
    height: 0;
    --text-opacity: 100;
  }

  100% {
    width: 91.666667%; /* w-11/12 */
    max-width: 24rem;
    height: 24rem; /* h-64 */
  }
}
@keyframes fade-out {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes text-draw-wait {
  0% {
    --text-opacity: 0;
  }
  80% {
    --text-opacity: 0;
  }
  100% {
    --text-opacity: 100;
  }
}
</style>

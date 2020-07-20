<template>
  <div class="container">
    <PlayerList />
    <PlayDrawStage class="mt-2" />
    <template v-if="$gm.isRoundFinished">
      <PlayVoteModalForPainter v-if="!isWerewolf" />
      <PlayVoteModalForWolf v-else />
    </template>
    <template v-if="$gm.isGameFinished">
      <PlayResultModal />
      <div class="w-full mt-5">
        <button class="btn exit" type="button" @click="$router.push('/lobby')">
          ロビーへ戻る
        </button>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { SystemMessage } from '../utils/message'
import PlayerList from '~/components/PlayerList.vue'
import PlayDrawStage from '~/components/PlayDrawStage.vue'
import PlayVoteModalForPainter from '~/components/PlayVoteModalForPainter.vue'
import PlayVoteModalForWolf from '~/components/PlayVoteModalForWolf.vue'
import PlayResultModal from '~/components/PlayResultModal.vue'
import { CurrentTurn } from '~/plugins/gameManager'
import { DrawStatus } from '~/utils/constant'
import { User } from '~/store/auth'

type CanvasHandler = {
  loadedTurn: number
  turn: number
  isMyTurn: boolean
  isRoundFinished: boolean
}
export default Vue.extend({
  components: {
    PlayerList,
    PlayDrawStage,
    PlayVoteModalForPainter,
    PlayVoteModalForWolf,
    PlayResultModal,
  },
  computed: {
    inited(): boolean {
      return !this.$gm.playground
    },
    currentTurn(): CurrentTurn | undefined {
      return this.$gm.playground?.currentTurn
    },
    isWerewolf(): boolean {
      return this.$gm.playground?.werewolf === this.$accessor.auth.user.id
    },
    isRoundFinished(): boolean {
      return this.currentTurn?.painter === ''
    },
    isGameFinished(): boolean {
      if (!this.$gm.playground) return false
      return this.$gm.playground?.result !== ''
    },
    user(): User {
      return this.$accessor.auth.user
    },
    canvasHandler(): CanvasHandler {
      return {
        loadedTurn: this.$canvas.loadedTurn,
        turn: this.$gm.playground?.currentTurn?.turn,
        isMyTurn: this.$gm.isMyTurn,
        isRoundFinished: this.currentTurn?.painter === '',
      }
    },
  },
  watch: {
    canvasHandler: {
      deep: true,
      handler(n: CanvasHandler, _o: CanvasHandler) {
        if (
          n.loadedTurn !== 0 &&
          n.loadedTurn === n.turn - 1 &&
          n.isMyTurn &&
          !n.isRoundFinished
        ) {
          // my turn
          this.$messages.pushSystemMessage(
            {
              body: SystemMessage.INFO_FOR_A_YOUR_TURN,
              roomId: this.$room.info.id,
            },
            'all'
          )
        } else if (n.loadedTurn === n.turn && n.isRoundFinished) {
          // vote start
          this.$gm.isRoundFinished = true
          this.$messages.pushSystemMessage(
            {
              body: SystemMessage.INFO_FOR_A_PAINT_END,
              roomId: this.$room.info.id,
            },
            'all'
          )
          this.$messages.pushSystemMessage(
            {
              body: SystemMessage.INFO_FOR_P_VOTE_START,
              roomId: this.$room.info.id,
            },
            'paiter'
          )
          this.$messages.pushSystemMessage(
            {
              body: SystemMessage.INFO_FOR_W_ANSWER_THEME_START,
              roomId: this.$room.info.id,
            },
            'werewolf'
          )
        }
      },
    },
    async '$canvas.drawStatus'(n: DrawStatus, o: DrawStatus) {
      if (n === 'stop' && o !== 'stop') {
        await Promise.all([
          this.$canvas.postLine(this.$room.info.id, this.$gm.playground!.id),
          this.$gm.next(this.$room.info.id),
        ])
      }
    },
    async isGameFinished(n: boolean, o: boolean) {
      if (n && !o) {
        await this.$gm.close(this.$room.info.id)
        this.$gm.isGameFinished = true
      }
    },
  },
  async validate({ app, redirect }) {
    // 認証状態の確認
    return await app.$accessor.auth
      .asyncAuth()
      .then(async () => {
        // 認証済みの場合、入室済みの部屋へ入室
        if (!Object.keys(app.$room.info).length)
          await app.$gm.reJoin(app.$accessor.auth.user.id).catch(() => {
            // 入室済みの部屋が無い場合
            redirect('/lobby')
          })
        return true
      })
      .catch(() => {
        // 未認証の場合ログインページへ
        redirect('/')
        return false
      })
  },
  async mounted() {
    await this.$gm.init(this.$room.info.id)
    this.$gm.attachPlayground(this.$room.info.id, this.$gm.playground!.id)
    this.$gm.attachLineList(this.$room.info.id, this.$gm.playground!.id)
  },
  beforeDestroy() {
    this.$gm.detachPlayground()
    this.$gm.detachLineList()
    this.$room.detachRoom()
  },
})
</script>
<style>
.container {
  @apply flex flex-wrap content-start justify-center items-start text-center mx-auto;
}

.title {
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}

.btn {
  @apply relative;
  @apply inline-flex items-center justify-center;
  @apply w-32;
  @apply m-1;
  @apply rounded-full;
  @apply tracking-widest;
  box-shadow: 1px 1px 3px rgba(255, 255, 255, 0.5) inset;
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

.exit {
  @apply border border-paint-blue;
  @apply text-paint-blue;
  @apply bg-paint-blue;
  --bg-opacity: 0.15;
}
.exit:hover:not(:disabled),
.exit:focus:not(:disabled) {
  @apply bg-paint-blue;
}
</style>

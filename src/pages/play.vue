<template>
  <div class="container">
    <PlayDrawStage />
    <template v-if="$gm.isRoundFinished">
      <PlayVoteModalForPainter v-if="!isWerewolf" />
      <PlayVoteModalForWolf v-else />
    </template>
    <template v-if="$gm.isGameFinished">
      <div class="w-full">
        <button
          style="width: 104px; height: 26px; font-size: 6px;"
          class="mt-2 hover:opacity-75 btn-primary"
          type="button"
          @click="$router.push('lobby')"
        >
          ロビーへ戻る
        </button>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { SystemMessage } from '../utils/message'
import PlayDrawStage from '~/components/PlayDrawStage.vue'
import PlayVoteModalForPainter from '~/components/PlayVoteModalForPainter.vue'
import PlayVoteModalForWolf from '~/components/PlayVoteModalForWolf.vue'
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
    PlayDrawStage,
    PlayVoteModalForPainter,
    PlayVoteModalForWolf,
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
    return await app.$accessor.auth
      .asyncAuth()
      .then(async () => {
        if (!Object.keys(app.$room.info).length)
          await app.$room.reJoin(app.$accessor.auth.user.id).catch(() => {
            redirect('/lobby')
          })
        return true
      })
      .catch(() => {
        return false
      })
  },
  async mounted() {
    await this.$gm.init(this.$room.info.id)
    this.$gm.attachPlayground(this.$room.info.id, this.$gm.playground!.id)
    this.$gm.attachLineList(this.$room.info.id, this.$gm.playground!.id)
  },
})
</script>
<style>
.container {
  @apply flex flex-wrap content-start justify-center items-start text-center mx-auto bg-base;
}

.title {
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

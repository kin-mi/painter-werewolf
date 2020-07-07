<template>
  <div
    ref="stage"
    class="bg-gray-500 mx-auto"
    style="width: 350px; height: 400px;"
  />
</template>
<script lang="ts">
import Vue from 'vue'
import { UserColors, DrawStatus } from '~/utils/constant'
import { Playground } from '~/plugins/gameManager'
export default Vue.extend({
  watch: {
    // "stop" => isMyTrun => "start" => Drawing => "finish" => "stop"
    '$canvas.drawStatus'(n: DrawStatus, o: DrawStatus) {
      if (n === 'finish' && o === 'start') {
        this.$canvas.drawStatus = 'stop'
      }
    },
    '$gm.isMyTurn'(n: boolean, o: boolean) {
      if (n && !o && this.$canvas.drawStatus === 'stop')
        this.$canvas.drawStatus = 'start'
    },
    '$gm.playground'(n: Playground, o: Playground) {
      if (n && !o) {
        this.$nextTick(() => {
          const color =
            this.$gm.playground!.players.find(
              (e) => e.id === this.$accessor.auth.user.id
            )?.color || UserColors.black
          this.$canvas.mount(this.$refs.stage as HTMLDivElement, color)
        })
      }
    },
  },
})
</script>

<template>
  <div class="stage-container">
    <div ref="stage" class="w-full h-full" />
    <PlayDrawStageFilter class="stage-filter" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PlayDrawStageFilter from '~/components/PlayDrawStageFilter.vue'
import { UserColors, DrawStatus } from '~/utils/constant'
import { Playground } from '~/plugins/gameManager'
export default Vue.extend({
  components: {
    PlayDrawStageFilter,
  },
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
  mounted() {
    this.$nextTick(() => {
      const color =
        this.$room.info.playersStatus.find(
          (e) => e.id === this.$accessor.auth.user.id
        )?.color || UserColors.black
      this.$canvas.mount(this.$refs.stage as HTMLDivElement, color)
    })
  },
})
</script>
<style scoped>
.stage-container {
  @apply relative;
  @apply bg-gray-500 mx-auto rounded-md overflow-hidden;
  width: 350px;
  height: 400px;
  background-image: url('/images/bg-canvas.png');
  background-size: cover;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4);
}
.stage-filter {
  @apply absolute top-0 left-0;
}
</style>

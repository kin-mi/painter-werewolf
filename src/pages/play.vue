<template>
  <div class="container">
    <div
      ref="stage"
      class="bg-gray-500 mx-auto"
      style="width: 350px; height: 400px;"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { DrawStatus } from '~/utils/constant'

export default Vue.extend({
  computed: {
    user() {
      return this.$accessor.auth.user
    },
  },
  watch: {
    async '$canvas.drawStatus'(
      n: DrawStatus | undefined,
      _o: DrawStatus | undefined
    ) {
      console.log('call $canvas.drawStatus', n)
      if (n === 'finish') {
        await this.$canvas.postLine(this.$room.info.id, this.$gm.playground.id)
        console.log('posted line')
        this.$canvas.drawStatus = 'stop'
      }
    },
  },
  async mounted() {
    await this.$gm.init(this.$room.info.id)
    this.$gm.attachPlayground(this.$room.info.id, this.$gm.playground.id)
    this.$gm.attachLineList(this.$room.info.id, this.$gm.playground.id)
    const color =
      this.$gm.playground.players.find((e) => e.id === this.user.id)?.color ||
      '#1A202C'
    this.$canvas.drawStatus = 'start'
    this.$canvas.mount(this.$refs.stage as HTMLDivElement, color)
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

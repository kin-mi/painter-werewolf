<template>
  <!--Modal-->
  <transition name="modal">
    <div v-if="!voted" class="modal">
      <div class="modal-container">
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content">
          <!--Title-->
          <div class="modal-title">
            <p>人狼を1人選んでください</p>
          </div>

          <!--Body-->
          <form class="modal-body" autocomplete="off">
            <template v-for="user in targetUsers">
              <div :key="`input${user.id}`" class="input-wrapper">
                <input
                  :id="user.id"
                  v-model="voteResult"
                  type="radio"
                  :value="user.id"
                  class="modal-form-part"
                />
                <label
                  :for="user.id"
                  :style="{ color: user.color }"
                  class="modal-form-label"
                  >{{ user.playerName }}</label
                >
              </div>
            </template>
          </form>

          <!--Footer-->
          <div class="flex justify-center mt-5">
            <button class="btn-primary" @click="vote">
              投票する
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from 'vue'
import { PlayUser } from '~/plugins/gameManager'
export default Vue.extend({
  data() {
    return {
      voteResult: this.$gm.playground?.players.filter((e) => {
        return e.id !== this.$accessor.auth.user.id
      })[0].id,
      voted: this.$gm.playground?.votes.some(
        (e) => e.id === this.$accessor.auth.user.id
      ),
    }
  },
  computed: {
    targetUsers(): PlayUser[] {
      return (
        this.$gm.playground?.players.filter((e) => {
          return e.id !== this.$accessor.auth.user.id
        }) || []
      )
    },
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
  @apply w-11/12 max-w-sm mx-auto;
  @apply bg-base-light;
  @apply border-2 border-paint-brown rounded;
  @apply shadow-lg;
  @apply overflow-y-auto;
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
</style>

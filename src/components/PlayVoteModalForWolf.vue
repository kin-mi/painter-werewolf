<template>
  <!--Modal-->
  <transition name="modal">
    <div v-if="!voted" class="modal">
      <div class="modal-container">
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content">
          <!--Title-->
          <div class="modal-title">
            <p>お題を入力してください</p>
          </div>

          <!--Body-->
          <form class="modal-body" autocomplete="off">
            <input
              id="message"
              v-model="voteResult"
              class="modal-form-part"
              type="text"
            />
          </form>

          <!--Footer-->
          <div class="flex justify-center mt-3">
            <button class="btn-primary" @click="vote">
              送信する
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      voteResult: '',
      voted: false,
    }
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

.modal-form-part {
  @apply w-full h-auto;
  @apply px-2 py-2;
  @apply border-b border-paint-brown rounded-t-sm;
  @apply text-left text-paint-brown font-bold;
  @apply bg-base-dark bg-opacity-50;
}
.modal-form-part:focus {
  @apply outline-none;
  box-shadow: 0 0 0 3px rgba(198, 153, 159, 0.5);
}
</style>

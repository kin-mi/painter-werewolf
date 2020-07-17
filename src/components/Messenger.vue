<template>
  <div class="fixed bottom-0 w-full">
    <div
      ref="messageWrapper"
      class="chat-wrapper"
      :class="collapse ? 'collapse' : 'expand'"
    >
      <template v-for="(message, index) in messageList">
        <MessengerCard :key="index" :message="message" />
      </template>
      <div class="collapseBtn" @click="collapse = !collapse">
        <arrow-expand v-if="collapse" />
        <arrow-collapse v-else />
      </div>
    </div>
    <div
      class="max-w-md flex mt-1 my-4 mb-1 rounded-lg border-2 border-green-800 overflow-hidden mx-auto"
    >
      <input
        v-model="messageBody"
        type="text"
        class="w-full px-2 py-1 text-sm"
        @keydown.enter="send"
      />
      <span
        class="text-sm leading-loose whitespace-no-wrap text-green-100 bg-green-800 px-3 border-l-2 border-green-800 cursor-pointer"
        @click="send"
        >送信</span
      >
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Message } from '~/plugins/messenger'
import MessengerCard from '~/components/MessengerCard.vue'

export default Vue.extend({
  components: {
    MessengerCard,
  },
  data(): { messageBody: string; collapse: boolean } {
    return {
      messageBody: '',
      collapse: true,
    }
  },
  computed: {
    messageList(): Message[] {
      return this.$messages.list
    },
  },
  watch: {
    async messageList(_n, _o): Promise<void> {
      await this.scrollToBottom()
    },
  },
  async mounted(): Promise<void> {
    this.$messages.attachMessageList(this.$room.info.id)
    await this.scrollToBottom()
  },
  beforeDestroy() {
    this.$messages.detachMessageList()
  },
  methods: {
    async send(event?: Event): Promise<void> {
      if (event instanceof KeyboardEvent && event.keyCode !== 13) return
      if (this.messageBody) {
        const body = this.messageBody
        this.messageBody = ''
        await this.$messages.push({
          body,
          roomId: this.$room.info.id,
        })
      }
    },
    async scrollToBottom(): Promise<void> {
      await this.$nextTick(() => {
        const wrapperElement = this.$refs.messageWrapper as Element
        wrapperElement.scrollTop = wrapperElement.scrollHeight
      })
    },
  },
})
</script>
<style scoped>
.chat-wrapper {
  @apply relative;
  @apply max-w-md mt-2 mx-auto;
  min-height: 12vh;
  @apply overflow-auto;
  @apply bg-white bg-opacity-50 border-t border-green-800 rounded-t-sm shadow;
}
.collapse {
  height: 12vh;
}
.expand {
  height: auto;
  max-height: 40vh;
}
.collapseBtn {
  @apply absolute top-0 right-0 mr-1 text-gray-800 cursor-pointer;
}
</style>

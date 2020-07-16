<template>
  <div class="fixed bottom-0 w-full">
    <div ref="messageWrapper" class="chat-wrapper">
      <template v-for="(message, index) in messageList">
        <MessengerCard :key="index" :message="message" />
      </template>
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
  data() {
    return {
      messageBody: '',
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
  @apply relative bg-gray-200 border border-green-800 rounded-md shadow;
  @apply max-w-md mt-2 mx-auto;
  @apply overflow-auto;
  height: 10vh;
}
</style>

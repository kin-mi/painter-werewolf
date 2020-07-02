<template>
  <div class="fixed bottom-0 w-full">
    <div
      ref="messageWrapper"
      class="max-w-md max-h-screen-1/5 h-auto mt-2 mx-auto bg-gray-200 border border-green-800 rounded-md shadow overflow-x-scroll overflow-y-scroll"
    >
      <div class="w-full flex text-left text-xs">
        <div class="w-full h-auto flex flex-col">
          <div class="px-2 py-2 flex-1">
            <!-- message template -->
            <template v-for="(message, index) in messageList">
              <div :key="index" class="flex items-start mb-4">
                <img
                  src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
                  class="w-10 h-10 rounded-full mr-3"
                />
                <div class="flex flex-col">
                  <div class="flex items-end">
                    <span class="font-bold text-md mr-2 font-sans">{{
                      message.playerName
                    }}</span>
                    <span class="text-grey text-xs font-light">{{
                      $dayjs(message.createAt).format('HH:MM')
                    }}</span>
                  </div>
                  <p
                    class="w-full font-light text-md text-gray-800 pt-1 break-words"
                  >
                    {{ message.body }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
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
export default Vue.extend({
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

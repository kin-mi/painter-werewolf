<template>
  <div class="h-64">
    <div
      ref="messageWrapper"
      class="w-64 mt-2 bg-gray-200 border border-green-800 rounded-md shadow mx-auto max-h-full h-auto overflow-x-scroll overflow-y-scroll"
    >
      <div class="flex text-left text-xs">
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
                      message.createAt
                        ? `${('00' + message.createAt.getHours()).slice(-2)}:${(
                            '00' + message.createAt.getMinutes()
                          ).slice(-2)}`
                        : ''
                    }}</span>
                  </div>
                  <p class="font-light text-md text-grey-darkest pt-1">
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
      class="w-full flex mt-1 my-4 mb-4 rounded-lg border-2 border-green-800 overflow-hidden mx-auto"
    >
      <input
        v-model="messageBody"
        type="text"
        class="w-full px-2 py-1 text-sm"
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
      return this.$messages.get()
    },
  },
  watch: {
    async messageList(_n, _o): Promise<void> {
      await this.scrollToBottom()
    },
  },
  async mounted(): Promise<void> {
    this.$messages.listen()
    await this.scrollToBottom()
  },
  methods: {
    async send(): Promise<void> {
      if (this.messageBody) {
        await this.$messages.push(this.messageBody)
        this.messageBody = ''
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

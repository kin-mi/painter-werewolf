<template>
  <div class="w-full flex items-start mb-1 px-2 py-1 text-left text-xs">
    <img
      :src="require(`~/assets/images/${message.icon}`)"
      class="w-10 h-10 rounded-full mr-3"
      :style="{ 'background-color': message.color }"
    />
    <div class="flex flex-col">
      <div class="flex items-end leading-3 pt-1">
        <span
          class="font-bold text-sm mr-2 font-sans"
          :style="{ color: message.color }"
          >{{ message.playerName }}</span
        >
        <span class="text-gray-800 text-xs font-light">{{
          $dayjs(message.createAt).format('HH:MM')
        }}</span>
      </div>
      <p
        class="w-full mt-1 pr-3 font-light text-gray-800 leading-4 break-words"
      >
        {{ message.body }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Message } from '~/plugins/messenger'
export default Vue.extend({
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
  },
})
</script>

<template>
  <div class="w-full flex items-start mb-4 px-2 py-1 text-left text-xs">
    <img
      src="https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
      class="w-10 h-10 rounded-full mr-3"
    />
    <div class="flex flex-col">
      <div class="flex items-end">
        <span
          class="font-bold text-md mr-2 font-sans"
          :style="{ color: message.color }"
          >{{ message.playerName }}</span
        >
        <span class="text-grey text-xs font-light">{{
          $dayjs(message.createAt).format('HH:MM')
        }}</span>
      </div>
      <p class="w-full font-light text-md text-gray-800 pt-1 break-words">
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

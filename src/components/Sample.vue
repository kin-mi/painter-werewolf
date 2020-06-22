<template>
  <div>
    <p>Sample Component.</p>
    <p>{{ `${fullName} ${message}` }}</p>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'

export interface User {
  firstName: string
  lastName: number
}

export default Vue.extend({
  name: 'Sample',
  props: {
    user: {
      type: Object,
      required: true,
    } as PropOptions<User>,
  },
  data() {
    return {
      message: 'This is a message',
    }
  },
  computed: {
    fullName(): string {
      return `${this.user.firstName} ${this.user.lastName}`
    },
  },
})
</script>

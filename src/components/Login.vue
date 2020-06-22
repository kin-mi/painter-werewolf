<template>
  <div class="w-full max-w-xs mx-auto mt-2">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="username"
        >
          Username
        </label>
        <input
          id="username"
          v-model="displayName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Username"
        />
      </div>
      <div class="flex items-center justify-center">
        <button
          class="btn"
          type="button"
          :disabled="!this.$accessor.auth.ready || !displayName"
          @click="login"
        >
          Sign In
        </button>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { User } from '~/store/auth'

export default Vue.extend({
  name: 'Login',
  data() {
    return {
      displayName: this.$accessor.auth.user.displayName,
    }
  },
  methods: {
    login() {
      const user = this.$fireAuth.currentUser
      if (user && this.displayName) {
        user.updateProfile({
          displayName: this.displayName,
        })
        this.setUser(user)
      } else {
        this.$fireAuth.signInAnonymously().then((result) => {
          if (result?.user !== null) {
            result.user.updateProfile({
              displayName: this.displayName,
            })
            this.setUser(result.user)
          }
        })
      }
    },
    setUser(user: firebase.User) {
      this.$accessor.auth.SET_USER({
        id: user.uid,
        displayName: user.displayName || '',
        playerName: this.displayName,
      } as User)
    },
  },
})
</script>
<style scoped>
.btn {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded;
}
.btn:hover {
  @apply bg-blue-700;
}
.btn:focus {
  @apply outline-none shadow-outline;
}
.btn:disabled {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed;
}
</style>

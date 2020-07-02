<template>
  <div class="w-full max-w-xs mx-auto mt-2">
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Username
      </label>
      <input
        id="username"
        v-model="displayName"
        class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Username"
      />
    </div>
    <div class="flex items-center justify-center">
      <button
        :style="{
          width: '104px',
          height: '36px',
          fontSize: '13px',
        }"
        class="hover:opacity-75 btn-primary"
        type="button"
        :disabled="!this.$accessor.auth.ready || !displayName"
        @click="login"
      >
        Sign In
      </button>
    </div>
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
    async login() {
      const user = this.$fireAuth.currentUser
      if (user && this.displayName) {
        user.updateProfile({
          displayName: this.displayName,
        })
        this.setUser(user)
      } else {
        await this.$fireAuth
          .signInAnonymously()
          .then((result) => {
            if (result?.user !== null) {
              result.user.updateProfile({
                displayName: this.displayName,
              })
              this.setUser(result.user)
            }
          })
          // eslint-disable-next-line no-console
          .catch((e) => console.error(e))
      }
      this.$emit('loggedIn')
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

<template>
  <div class="container">
    <h1 class="mt-2">
      <img class="object-scale-down w-full max-w-2xl" src="/images/Logo.png" />
    </h1>
    <LoginForm
      class="w-full"
      :display-name.sync="displayName"
      @input="setName"
      @click="login"
    />
    <RuleDescription class="w-full" />
    <!-- <LoginButton
      class="w-full mt-3"
      :is-disabledd="!this.$accessor.auth.ready || !displayName"
      @click="login"
    /> -->
    <Copyright />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LoginForm from '~/components/LoginForm.vue'
import RuleDescription from '~/components/RuleDescription.vue'
import Copyright from '~/components/Copyright.vue'

export default Vue.extend({
  components: {
    LoginForm,
    RuleDescription,
    Copyright,
  },
  data() {
    return {
      displayName: this.$accessor.auth.user.displayName,
    }
  },
  methods: {
    setName(value) {
      this.displayName = value
    },
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
      this.$router.push('lobby')
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

<style>
.container {
  @apply min-h-screen flex flex-wrap content-start justify-center items-start text-center mx-auto;
}

.title {
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

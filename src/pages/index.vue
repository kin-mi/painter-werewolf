<template>
  <div class="top-container">
    <h1 class="mt-2">
      <img
        class="object-scale-down w-full max-w-2xl max-h-full"
        src="/images/Logo.png"
      />
    </h1>
    <LoginForm
      ref="loginForm"
      class="w-full"
      :display-name.sync="displayName"
      @input="setName"
      @click="login"
    />
    <RuleDescription class="w-full" />
    <LoginButton class="mt-2" @click="login" />
    <Copyright />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LoginForm from '~/components/LoginForm.vue'
import RuleDescription from '~/components/RuleDescription.vue'
import LoginButton from '~/components/LoginButton.vue'
import Copyright from '~/components/Copyright.vue'
import { User } from '~/store/auth'

export default Vue.extend({
  components: {
    LoginForm,
    LoginButton,
    RuleDescription,
    Copyright,
  },
  data() {
    return {
      displayName: this.$accessor.auth.user.displayName,
    }
  },
  methods: {
    setName(value: string) {
      this.displayName = value
    },
    async login() {
      if (!this.$accessor.auth.ready || !this.displayName) {
        const VueScrollTo = require('vue-scrollto')
        VueScrollTo.scrollTo(this.$refs.loginForm)
      } else {
        const user = this.$fireAuth.currentUser
        if (user) {
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
      }

      // const user = this.$fireAuth.currentUser
      // if (user && this.displayName) {
      //   user.updateProfile({
      //     displayName: this.displayName,
      //   })
      //   this.setUser(user)
      // } else {
      //   await this.$fireAuth
      //     .signInAnonymously()
      //     .then((result) => {
      //       if (result?.user !== null) {
      //         result.user.updateProfile({
      //           displayName: this.displayName,
      //         })
      //         this.setUser(result.user)
      //       }
      //     })
      //     // eslint-disable-next-line no-console
      //     .catch((e) => console.error(e))
      // }
      // this.$router.push('lobby')
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
.top-container {
  @apply min-h-screen flex flex-wrap content-start justify-center items-start text-center mx-auto pb-16;
}

.title {
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

<template>
  <div class="top-container">
    <h1 class="mt-2 mx-2 w-full">
      <img
        class="object-scale-down w-full max-w-2xl mx-auto"
        src="/images/logo_title.svg"
      />
    </h1>
    <LoginForm
      ref="loginForm"
      class="w-full"
      :display-name.sync="displayName"
      :selected-icon.sync="selectedIcon"
      @input="setName"
      @selected="setIcon"
    />
    <LoginButton
      class="w-full mt-3"
      :is-disabled="!$accessor.auth.isReady || !displayName"
      @click="login"
      >ロビーへ入る</LoginButton
    >
    <RuleDescription class="w-full mt-5" />
    <LoginButton class="w-full mt-3" @click="login">ロビーへ入る</LoginButton>
    <Copyright />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import LoginForm from '~/components/LoginForm.vue'
import RuleDescription from '~/components/RuleDescription.vue'
import LoginButton from '~/components/LoginButton.vue'
import Copyright from '~/components/Copyright.vue'
import { IconFileName } from '~/utils/constant'
import { User } from '~/store/auth'

export default Vue.extend({
  layout: 'top',
  components: {
    LoginForm,
    LoginButton,
    RuleDescription,
    Copyright,
  },
  data() {
    return {
      displayName: this.$accessor.auth.user.displayName,
      selectedIcon: this.$accessor.auth.user.photoURL
        ? String(
            IconFileName.findIndex(
              (e) => e === this.$accessor.auth.user.photoURL
            ) + 1
          )
        : '1',
    }
  },
  computed: {
    iconURL(): string {
      return IconFileName[Number(this.selectedIcon) - 1]
    },
  },
  methods: {
    setName(value: string) {
      this.displayName = value
    },
    setIcon(value: string) {
      this.selectedIcon = value
    },
    async login() {
      if (!this.$accessor.auth.ready || !this.displayName) {
        const VueScrollTo = require('vue-scrollto')
        VueScrollTo.scrollTo(this.$refs.loginForm)
      } else {
        const user = this.$fireAuth.currentUser!
        if (user) {
          user.updateProfile({
            displayName: this.displayName,
            photoURL: this.iconURL,
          })
          this.setUser(user)
        } else {
          await this.$fireAuth
            .signInAnonymously()
            .then((result) => {
              if (result?.user !== null) {
                result.user.updateProfile({
                  displayName: this.displayName,
                  photoURL: this.iconURL,
                })
                this.setUser(result.user)
              }
            })
            // eslint-disable-next-line no-console
            .catch((e) => console.error(e))
        }
        this.$router.push('lobby')
      }
    },
    setUser(user: firebase.User) {
      this.$accessor.auth.SET_USER({
        id: user.uid,
        displayName: user.displayName || '',
        playerName: this.displayName,
        photoURL: this.iconURL,
      } as User)
    },
  },
})
</script>

<style>
.top-container {
  @apply flex flex-wrap content-start justify-center items-start;
  @apply min-h-screen  text-center mx-auto pb-16;
}

.title {
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

<template>
  <div class="top-container">
    <h1 class="mt-2 mx-2 w-full">
      <img
        class="object-scale-down w-full max-w-2xl mx-auto"
        src="/images/logo_title.svg"
      />
    </h1>

    <div class="w-full">
      <RuleDescription
        class="w-full max-w-lg mx-auto px-3 mt-5"
        @open="ruleOpen = true"
      />
    </div>
    <div class="w-full">
      <img
        src="/images/werewolf_top.png"
        class="mx-auto"
        style="max-height: 30vh;"
      />
    </div>
    <LoginForm
      ref="loginForm"
      class="w-full max-w-xs mx-auto mt-3"
      v-bind="$accessor.auth.user"
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
    <Copyright class="z-0" :class="ruleOpen ? '' : ['fixed', 'bottom-0']" />
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
      ruleOpen: false,
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
          await user.updateProfile({
            displayName: this.displayName,
            photoURL: this.iconURL,
          })
          this.setUser(user)
        } else {
          await this.$fireAuth
            .signInAnonymously()
            .then(async (result) => {
              if (result?.user !== null) {
                await result.user.updateProfile({
                  displayName: this.displayName,
                  photoURL: this.iconURL,
                })
                this.setUser(result.user)
              }
            })
            // eslint-disable-next-line no-console
            .catch((e) => console.error(e))
        }
        this.$router.push('/lobby')
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
  @apply relative;
  @apply flex flex-wrap content-start justify-center items-start;
  @apply min-h-screen  text-center mx-auto;
}

.title {
  font-weight: 300;
  font-size: 80px;
  color: #35495e;
  letter-spacing: 1px;
}
</style>

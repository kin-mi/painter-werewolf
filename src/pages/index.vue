<template>
  <div class="container">
    <h1 class="title w-full">お絵かき人狼</h1>
    <Login class="w-full" @loggedIn="goLobi" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Login from '~/components/Login.vue'

export default Vue.extend({
  components: {
    Login,
  },
  methods: {
    goLobi(): void {
      this.$router.push('lobby')
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

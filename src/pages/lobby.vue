<template>
  <div class="container">
    <div class="bg-lobby" />
    <header class="header" :class="scrollY > 50 ? 'shrink' : ''">
      <div class="wrap">
        <img
          class="object-scale-down w-full h-6 mx-auto px-4 bg-white bg-opacity-50 rounded-t-lg"
          src="/images/Logo.png"
        />
        <h1>LOBBY</h1>
      </div>
    </header>
    <!-- <template v-if="!isJoined">
      <div class="w-full flex items-center justify-center">
        <RoomCreate />
      </div>
      <div class="w-full flex items-center justify-center">
        <RoomList />
      </div>
    </template>
    <template v-else>
      <Room />
    </template> -->
    <div class="w-full mt-64 py-64" />
    <div class="w-full mt-64 py-64" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import RoomCreate from '~/components/RoomCreate.vue'
// import RoomList from '~/components/RoomList.vue'
// import Room from '~/components/Room.vue'

export default Vue.extend({
  // components: {
  //   RoomCreate,
  //   RoomList,
  //   Room,
  // },
  async validate({ app }) {
    return await app.$accessor.auth
      .asyncAuth()
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
  },
  data() {
    return {
      scrollY: 0,
    }
  },
  computed: {
    isJoined(): boolean {
      return !!Object.keys(this.$room.info).length
    },
  },
  mounted() {
    window.addEventListener('scroll', this.calculateScrollY)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.calculateScrollY)
  },
  methods: {
    calculateScrollY() {
      this.scrollY = window.scrollY
    },
  },
})
</script>

<style>
.container {
  @apply flex flex-wrap content-start justify-center items-start;
  @apply mx-auto;
  @apply text-center;
}
.bg-lobby {
  @apply fixed top-0 left-auto;
  @apply w-10/12;
  height: 95%;
  @apply mt-3 mb-3;
  @apply rounded-lg;
  @apply bg-paint-brown;
  @apply border-2 border-paint-brown;
  background-image: url('/images/bg-cork.jpg');
  background-size: 100% auto;
  @apply bg-fixed;
  @apply shadow-xl;
}
.header {
  @apply fixed top-0 left-auto;
  @apply w-3/4;
  height: 120px;
  @apply mt-4;
  @apply transition-size duration-500;
}
.header .wrap {
  @apply w-full my-0 mx-auto;
  /* width: 90%; */
  max-width: 69em;
}
.header h1 {
  @apply inline-block relative;
  text-shadow: -1px 0px theme('colors.white'), 0px -1px theme('colors.white'),
    1px 0px theme('colors.white'), 0px 1px theme('colors.white'),
    1px 1px theme('colors.white'), -1px -1px theme('colors.white'),
    1px -1px theme('colors.white'), -1px 1px theme('colors.white');
  line-height: 80px;
}

.header h1 {
  @apply m-0 mx-auto;
  @apply text-paint-brown;
  font-family: 'Slabo 27px', serif;
  font-size: 72px;
  text-transform: uppercase;
}
/* Shrinking */
.header h1 {
  @apply transition-all duration-500;
}

.header.shrink {
  height: 75px;
}

.header.shrink h1 {
  line-height: 40px;
}

.header.shrink h1 {
  font-size: 2em;
  text-shadow: -1px 0px theme('colors.white'), 0px -1px theme('colors.white'),
    1px 0px theme('colors.white'), 0px 1px theme('colors.white'),
    1px 1px theme('colors.white'), -1px -1px theme('colors.white'),
    1px -1px theme('colors.white'), -1px 1px theme('colors.white');
}
</style>

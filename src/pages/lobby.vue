<template>
  <div class="container">
    <header class="header">
      <img
        class="object-scale-down w-full h-6 mx-auto px-4 bg-white bg-opacity-50 rounded-sm"
        src="/images/Logo.png"
      />
      <div class="wrap">
        <h1>LOBBY</h1>
      </div>
    </header>
    <template v-if="!isJoined">
      <RoomCreate class="w-full" />
      <RoomList class="w-full mt-4" />
    </template>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import RoomCreate from '~/components/RoomCreate.vue'
import RoomList from '~/components/RoomList.vue'
// import Room from '~/components/Room.vue'

export default Vue.extend({
  components: {
    RoomCreate,
    RoomList,
    // Room,
  },
  async validate({ app, redirect }) {
    return await app.$accessor.auth
      .asyncAuth()
      .then(async () => {
        if (!Object.keys(app.$room.info).length)
          await app.$room.reJoin(app.$accessor.auth.user.id).catch(() => {
            return true
          })
        return true
      })
      .catch(() => {
        redirect('/')
        return false
      })
  },
  computed: {
    isJoined(): boolean {
      return !!Object.keys(this.$room.info).length
    },
  },
})
</script>

<style>
.container {
  @apply flex flex-wrap content-start justify-center items-start;
  @apply w-10/12;
  @apply my-3 mx-auto;
  @apply text-center;
  @apply rounded-lg;
  @apply bg-paint-brown;
  @apply border-2 border-paint-brown;
  background-image: url('/images/bg-cork.jpg');
  background-size: 100% auto;
  @apply shadow-xl;
}

.header {
  @apply w-full;
  height: 100px;
  @apply mt-1 mx-4;
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
</style>

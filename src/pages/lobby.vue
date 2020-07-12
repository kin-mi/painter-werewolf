<template>
  <div class="container">
    <div class="logo-wrap">
      <img class="logo" src="/images/Logo.png" />
    </div>
    <header class="header">
      <div class="wrap">
        <img class="w-1/2 mx-auto text-red-600" src="/images/lobby3.svg" />

        <!-- <h1>LOBBY</h1> -->
      </div>
    </header>
    <template v-if="!isJoined">
      <!-- <RoomCreate class="w-full" /> -->
      <RoomList class="w-full mt-4" />
      <RoomList2 class="w-full mt-4" />
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
// import RoomCreate from '~/components/RoomCreate.vue'
import RoomList from '~/components/RoomList.vue'
// import Room from '~/components/Room.vue'

export default Vue.extend({
  components: {
    // RoomCreate,
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

<style scoped>
.container {
  @apply relative;
  @apply flex flex-wrap content-start justify-center items-start;
  @apply w-10/12;
  @apply my-3 mx-auto pb-2;
  @apply text-center;
  @apply rounded-sm;
  border-width: 5px;
  border-color: #fcd7b1;
  background-color: #d5a172;
  background-image: url('/images/bg-cork.jpg');
  background-size: 100% auto;
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.3),
    0px 0px 3px 3px rgba(0, 0, 0, 0.2) inset;
}

.header {
  @apply w-full h-auto;
  @apply mt-3 mx-auto;
  @apply transition-size duration-500;
}
.logo-wrap {
  @apply w-1/3 h-auto mt-1 ml-auto mr-1;
}
.logo {
  @apply object-scale-down px-1 py-1 bg-white bg-opacity-50 rounded-sm;
  @apply transform translate-y-3;
  --transform-rotate: 10deg;
}
@screen sm {
  .logo {
    @apply px-3;
    @apply transform translate-y-4;
    --transform-rotate: 10deg;
  }
}
@screen md {
  .logo {
    @apply px-5;
    @apply transform translate-y-5;
    --transform-rotate: 10deg;
  }
}
@screen lg {
  .logo {
    @apply px-8;
    @apply transform translate-y-8;
    --transform-rotate: 10deg;
  }
}

.header .wrap {
  @apply w-full my-0 mx-auto;
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

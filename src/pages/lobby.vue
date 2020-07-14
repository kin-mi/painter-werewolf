<template>
  <div class="container">
    <div class="logo-wrap">
      <img class="logo" src="/images/logo_title.svg" alt="お絵かき人狼" />
    </div>
    <header class="header">
      <div class="wrap">
        <h1>
          <img class="header-logo" src="/images/lobby2.svg" alt="LOBBY" />
        </h1>
      </div>
    </header>
    <template v-if="!isJoined">
      <RoomCreate class="w-full mt-4" />
      <RoomList class="w-full mt-3" />
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

<style scoped>
.container {
  @apply relative;
  @apply flex flex-wrap content-start justify-center items-start;
  @apply w-10/12;
  @apply mb-3 mx-auto pb-2;
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
  @apply mx-auto;
  @apply transition-size duration-500;
}
.logo-wrap {
  @apply absolute top-0 left-0;
  @apply w-full h-auto mt-1 mr-1 text-right;
}
.logo {
  @apply object-scale-down w-1/3 ml-auto px-1 py-1 bg-white bg-opacity-50 rounded-sm;
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
.header-logo {
  @apply w-full mx-auto text-red-600;
}
</style>

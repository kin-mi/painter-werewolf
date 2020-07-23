<template>
  <div id="content">
    <transition name="page">
      <nuxt class="flex-grow flex-1" />
    </transition>
    <transition name="bottom-up">
      <Messenger v-if="isMessengerOpen" />
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Messenger from '~/components/Messenger.vue'
export default Vue.extend({
  components: {
    Messenger,
  },
  computed: {
    isMessengerOpen() {
      return !!Object.keys(this.$room.info).length
    },
  },
  head: {
    bodyAttrs: {
      class: 'body',
    },
  },
})
</script>
<style>
html {
  font-family: 'Noto Sans JP', 'Source Sans Pro', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.body {
  @apply bg-fixed;
  background-position: 0px 0px;
  background-size: 600px 400px;
  background-color: #fff5e0;
  background-image: url('/images/bg.svg');
  animation: bg-slide 25s linear infinite;
}
@keyframes bg-slide {
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: -600px -400px;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

#__nuxt {
  /* overflow: hidden; */
  clip-path: polygon(
    0% 0px,
    0% 100%,
    100% 100%,
    100% 0%,
    calc(100% - 0px) 0%,
    calc(100% - 0px) 00px
  );
}

#content {
  @apply min-h-screen flex flex-col;
}

.page-enter-active,
.page-leave-active {
  will-change: opacity;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}

.bottom-up-enter-active,
.bottom-up-leave-active {
  transform: translate(0px, 0px);
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
}

.bottom-up-enter,
.bottom-up-leave-to {
  transform: translateY(100vh) translateY(0px);
}
</style>

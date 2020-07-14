<template>
  <div id="content">
    <transition name="page">
      <nuxt class="flex-grow flex-1" />
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  head: {
    bodyAttrs: {
      class: 'top-body',
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

/* .body {
  background-position: 0px 0px, 48px 48px, 96px 96px, 144px 144px, 192px 192px,
    240px 240px, 288px 288px, 336px 336px, 384px 384px, 432px 432px;
  background-size: 48px 48px;
  background-color: #fff5e0;
  background-image: url('/images/symbol_pen.svg'), url('/images/symbol_pen.svg'),
    url('/images/symbol_pen.svg'), url('/images/symbol_pen.svg'),
    url('/images/symbol_pen.svg'), url('/images/symbol_pen.svg'),
    url('/images/symbol_pen.svg'), url('/images/symbol_pen.svg'),
    url('/images/symbol_pen.svg'), url('/images/symbol_mark.svg');
  animation: bg-slide 5s linear infinite;
} */

.top-body {
  background-position: 0px 0px, 24px 24px;
  background-size: 48px 48px;
  background-color: #fff5e0;
  background-image: url('/images/symbol_pen.svg');
  animation: bg-slide 5s linear infinite;
}
@keyframes bg-slide {
  0% {
    background-position: 0px 0px, 48px 48px;
  }
  100% {
    background-position: -48px -48px, 0px 0px;
  }
}

/* .body {
  background-position: 0px 0px, 24px 24px;
  background-size: 48px 48px;
  background-image: -webkit-linear-gradient(
      45deg,
      #fff2d6 25%,
      transparent 25%,
      transparent 75%,
      #ffecc3 75%,
      #ffecc3 100%
    ),
    -webkit-linear-gradient(45deg, #ffecc3 25%, #fff5e0 25%, #fff5e0 75%, #ffecc3
          75%, #fff2d6 100%);
  background-image: linear-gradient(
      45deg,
      #ffecc3 25%,
      transparent 25%,
      transparent 75%,
      #ffecc3 75%,
      #ffecc3 100%
    ),
    linear-gradient(
      45deg,
      #ffecc3 25%,
      #fff5e0 25%,
      #fff5e0 75%,
      #ffecc3 75%,
      #ffecc3 100%
    );
  animation: bg-slide 5s linear infinite;
} */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

#__nuxt {
  overflow: hidden;
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
</style>

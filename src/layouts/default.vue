<template>
  <div id="content">
    <transition name="page">
      <nuxt class="flex-1" />
    </transition>
  </div>
</template>

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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  @apply bg-base;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 1s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
</style>

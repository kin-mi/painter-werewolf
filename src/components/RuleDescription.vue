<template>
  <div data-sticky-container>
    <div class="wrapper">
      <h2 class="text-paint-brown font-bold text-2xl">ルール説明</h2>
      <h3 class="badge mt-2">
        基本ルール
      </h3>
      <ul class="list">
        <li>
          <span>3 〜 10人で遊ぶゲームです</span>
        </li>
        <li>
          <span>
            ゲーム開始時にお題が出題されます
          </span>
        </li>
        <li>
          <span>
            お題の絵を順番に<span class="marker font-bold">一筆ずつ</span
            >描いていきましょう</span
          >
        </li>
      </ul>
      <h3 class="badge mt-2">
        勝 敗
      </h3>
      <ul class="list">
        <li>
          <span>
            みなさんは画家です
          </span>
        </li>
        <li>
          <span>
            ただし、1人だけ<span class="marker">お題を知らない人狼</span
            >が紛れ込んでいます
          </span>
        </li>
        <li>
          <span>
            最後に投票して、人狼を当てられたら画家たちの勝利です
          </span>
        </li>
        <li>
          <span>
            人狼は投票を逃れるか、<span class="marker font-bold"
              >お題を当てても勝ち</span
            >となります</span
          >
        </li>
      </ul>
      <h3 class="badge-underline mt-6">
        画家の心得
      </h3>
      <ul class="list">
        <li>
          <span> 誰が適当に絵を描いている人狼か推理しましょう</span>
        </li>
        <li>
          <span> 自分が疑われないような絵を描きましょう</span>
        </li>
        <li>
          <span>
            ただし、<span class="marker"
              >人狼にお題を悟られてはいけません</span
            ></span
          >
        </li>
      </ul>
      <h3 class="badge-underline mt-2">
        人狼の心得
      </h3>
      <ul class="list">
        <li>
          <span> 画家たちの絵を見ながら、お題を推測して絵を描きましょう</span>
        </li>
        <li>
          <span>
            人狼は一度だけ<span class="marker font-bold">画家を妨害</span
            >することが出来ます</span
          >
        </li>
        <li>
          <span>
            疑いの矛先を別の画家に仕向けて身を守りましょう
          </span>
        </li>
      </ul>
    </div>
    <div ref="sticky" class="footer-wrapper" :class="isSticky ? 'sticky' : ''">
      <div class="footer">
        <div class="footer-box">
          <div class="werewolf">
            <img src="/images/werewolf_top.png" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="isSticky" class="w-full" :style="`height: ${stickyHeight}px;`" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data(): {
    isSticky: boolean
    stickyTop: number
    stickyHeight: number
  } {
    return {
      isSticky: false,
      stickyTop: 0,
      stickyHeight: 0,
    }
  },
  computed: {
    scrollBottom(): number {
      const windowHeight = Math.min(
        window.innerWidth,
        window.parent.screen.width
      )
      return window.scrollY + windowHeight
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.stickyTop = this.$refs.sticky.getBoundingClientRect().top

      this.stickyHeight = this.$refs.sticky.offsetHeight
      this.stickyController()
      window.addEventListener('scroll', this.stickyController)
    })
  },
  methods: {
    stickyController() {
      const windowHeight = Math.min(
        window.innerWidth,
        window.parent.screen.width
      )
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      console.log({
        stickyTop: this.stickyTop,
        stickyHeight: this.stickyHeight,
        windowHeight,
        scrollTop,
      })
      console.log(
        'element pos',
        this.stickyTop + this.stickyHeight,
        'scroll pos',
        windowHeight + scrollTop,
        this.stickyTop + this.stickyHeight >= windowHeight + scrollTop
      )
      if (this.stickyTop + this.stickyHeight >= windowHeight + scrollTop)
        this.isSticky = true
      else this.isSticky = false
    },
  },
})
</script>

<style scoped>
.footer-space {
  margin-bottom: 100px;
}
.wrapper {
  @apply max-w-xs;
  max-width: 256px;
  @apply mx-auto;
  @apply pt-2 pb-5 px-4;
  @apply bg-white bg-opacity-75;
  @apply border-t-2 border-r-2 border-l-2 border-paint-brown rounded-t-lg;
  @apply transform;
  --transform-translate-x: -32px;
}
@screen md {
  .wrapper {
    @apply max-w-md;
  }
}

.badge {
  @apply w-24;
  @apply px-1;
  @apply text-center text-white;
  @apply bg-paint-brown;
  @apply rounded-full;
  @apply text-sm font-bold;
}
.badge-underline {
  @apply w-24;
  @apply px-1;
  @apply text-center text-paint-brown;
  @apply text-sm font-bold;
  background: linear-gradient(transparent 80%, theme('colors.paint.brown') 80%);
}
.list {
  @apply list-disc list-inside;
  @apply text-left text-sm;
}
.list li {
  @apply text-paint-brown;
}
.list li span {
  @apply text-paint-brown;
}

.footer-wrapper {
  @apply w-full;
  /* height: 100px; */
}
.footer {
  @apply max-w-xs;
  height: 30px;
  @apply mx-auto;
}
.footer-box {
  @apply relative h-full;
  width: 80%;
  background-color: #fffcf7;
  @apply border-b-2 border-r-2 border-l-2 border-paint-brown rounded-b-lg;
}
.footer-box::before {
  @apply z-20;
  content: '';
  position: absolute;
  top: 30%;
  right: -24px;
  margin-top: -12px;
  border: 12px solid transparent;
  border-left: 12px solid #fff;
}
.footer-box:after {
  @apply z-10;
  content: '';
  position: absolute;
  top: 30%;
  right: -28px;
  margin-top: -13px;
  border: 13px solid transparent;
  border-left: 13px solid theme('colors.paint.brown');
}
@screen md {
  .footer {
    @apply max-w-md;
  }
}
.werewolf {
  @apply absolute top-0 right-0;
  @apply transform;
  --transform-translate-y: -35%;
  --transform-translate-x: 80%;
}
.werewolf img {
  @apply z-10;
  max-height: 35vh;
  filter: drop-shadow(2px 0px 1px white) drop-shadow(-2px 0px 1px white)
    drop-shadow(0px -2px 1px white) drop-shadow(-2px 0px 1px white)
    drop-shadow(2px 2px 1px white) drop-shadow(-2px 2px 1px white)
    drop-shadow(2px -2px 1px white) drop-shadow(-2px -2px 1px white);
}
.sticky {
  @apply fixed bottom-0;
}
</style>

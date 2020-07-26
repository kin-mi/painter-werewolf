<template>
  <div class="flex flex-wrap">
    <div class="wrapper">
      <h2
        class="text-paint-brown font-bold text-2xl"
        :class="ruleOpen ? '' : 'cursor-pointer'"
        @click="openRule"
      >
        ルール説明
      </h2>
      <template v-if="ruleOpen">
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
      </template>
    </div>
    <div
      v-if="isSticky"
      class="footer-sticky-bg"
      :class="isSticky ? 'sticky' : ''"
    />
    <div ref="sticky" class="footer" :class="footerClass" @click="openRule">
      <img src="/images/werewolf_top.png" />
      <menu-down
        v-if="!ruleOpen"
        :size="36"
        class="inline-block transform -translate-y-3 text-paint-brown"
      />
    </div>
    <div v-if="isSticky" ref="sticky-mark" class="sticky-mark" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data(): {
    isSticky: boolean
    stickyTop: number
    stickyHeight: number
    ruleOpen: boolean
  } {
    return {
      isSticky: false,
      stickyTop: 0,
      stickyHeight: 0,
      ruleOpen: false,
    }
  },
  computed: {
    scrollBottom(): number {
      const windowHeight = window.parent.screen.width
      return window.scrollY + windowHeight
    },
    footerClass(): string[] {
      return [this.isSticky ? 'sticky' : '', this.ruleOpen ? '' : 'canOpen']
    },
  },
  methods: {
    stickyController() {
      // 画面の高さ＋スクロール量で表示されてる最下部の座標を取得
      const windowHeight = Math.min(
        window.innerHeight,
        window.parent.screen.height
      )
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      const viewBottomPos = windowHeight + scrollTop

      // sticky要素の絶対座標を取得
      const stickyElement = this.isSticky
        ? (this.$refs['sticky-mark'] as HTMLElement)
        : (this.$refs.sticky as HTMLElement)
      const stickyBottom =
        stickyElement.getBoundingClientRect().bottom + window.pageYOffset
      if (stickyBottom >= viewBottomPos) this.isSticky = true
      else this.isSticky = false
    },
    openRule() {
      if (this.ruleOpen) return
      this.ruleOpen = true
      this.$emit('open')
      this.$nextTick(() => {
        this.stickyController()
        window.addEventListener('scroll', this.stickyController)
      })
    },
  },
})
</script>

<style scoped>
.wrapper {
  @apply w-4/5  max-w-xs;
  @apply pt-2 pb-5 px-4;
  @apply bg-white bg-opacity-75;
  @apply border-t-2 border-r-2 border-l-2 border-paint-brown rounded-t-lg;
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
  @apply pl-3 text-paint-brown;
}
.list li span {
  @apply text-paint-brown;
}

.footer {
  @apply relative;
  @apply w-4/5 max-w-xs;
  @apply bg-white bg-opacity-75;
  height: 40px;
  @apply border-b-2 border-r-2 border-l-2 border-paint-brown;
  @apply rounded-b-lg;
}
.footer.canOpen {
  @apply h-1 rounded-b-sm border-b-4;
  @apply cursor-pointer;
}
.footer.sticky {
  @apply max-w-xs;
  width: calc(80% - 1.5rem + 5px);
  @apply bg-transparent;
}
.footer::before {
  @apply z-20;
  content: '';
  position: absolute;
  top: 30%;
  right: -23px;
  margin-top: -12px; /*margin-top: -23px;*/
  border: 12px solid transparent;
  border-left: 12px solid #fff;
}
.footer.canOpen::before {
  margin-top: -24px;
}
.footer::after {
  @apply z-10;
  content: '';
  position: absolute;
  top: 30%;
  right: -27px;
  margin-top: -13px;
  border: 13px solid transparent;
  border-left: 13px solid theme('colors.paint.brown');
}
.footer.canOpen::after {
  margin-top: -25px;
}

.footer-sticky-bg {
  @apply max-w-xs;
  height: 40px;
  width: calc(80% - 1.5rem + 5px);
  border-bottom: 8px solid #fffcf7;
  @apply transform translate-y-px;
}

.footer img {
  @apply absolute top-0 right-0;
  height: 220px;
  @apply transform;
  --transform-translate-y: -80px;
  --transform-translate-x: 85%;
  filter: drop-shadow(2px 0px 1px white) drop-shadow(-2px 0px 1px white)
    drop-shadow(0px -2px 1px white) drop-shadow(-2px 0px 1px white)
    drop-shadow(2px 2px 1px white) drop-shadow(-2px 2px 1px white)
    drop-shadow(2px -2px 1px white) drop-shadow(-2px -2px 1px white);
}

.sticky {
  @apply fixed bottom-0;
}
.sticky-mark {
  @apply max-w-xs;
  height: 40px;
  width: calc(80% - 1.5rem + 4px);
  @apply bg-white bg-opacity-75;
}
</style>

<template>
  <div class="w-full mt-3">
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
  </div>
</template>
<style scoped>
.wrapper {
  @apply max-w-xs;
  @apply mx-auto;
  @apply pt-2 pb-4 px-4;
  @apply rounded-lg;
  @apply bg-white bg-opacity-75;
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
  @apply w-20;
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
</style>

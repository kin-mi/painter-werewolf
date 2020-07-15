<template>
  <div></div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  asyncData({ app }) {
    // eslint-disable-next-line no-console
    console.log(app.$room.info)
    // console.log(route)
  },
  async validate({ app, redirect }) {
    // 認証状態の確認
    return await app.$accessor.auth
      .asyncAuth()
      .then(async () => {
        // 認証済みの場合、入室済みの部屋へ入室
        if (!Object.keys(app.$room.info).length) {
          await app.$room.reJoin(app.$accessor.auth.user.id).catch(() => {
            // 入室済みの部屋が無い場合
            return true
          })
        }

        return true
      })
      .catch(() => {
        // 未認証の場合ログインページへ
        redirect('/')
        return false
      })
  },
  mounted() {
    // console.log(this.$route.query.id)
  },
})
</script>

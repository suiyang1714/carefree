<template lang="pug">
  el-radio-group(v-model='isCollapse', style='margin-bottom: 20px;')
    el-radio-button(:label='false', v-if="isCollapse") 展开
    el-radio-button(:label='true', v-else="!isCollapse") 收起
    el-menu.el-menu-vertical-demo(default-active='1-4-1', @open='handleOpen', @close='handleClose', :collapse='isCollapse', router)
      el-menu-item(index='/admin')
        i.el-icon-document
        span() 管理员列表
      el-menu-item(index='/admin/problem?page=1')
        i.el-icon-menu
        span() 收取邮件
      el-menu-item(index='/admin/unsolved?page=1')
        i.el-icon-document
        span() 未解决邮件
      el-menu-item(index='/admin/solved?page=1')
        i.el-icon-setting
        span() 已解决邮件

    <!--aside-->
    <!--ul-->
    <!--li-->
    <!--nuxt-link(to='/admin') 管理员列表-->
    <!--li-->
    <!--nuxt-link(to='/admin/problem?page=1') 收取邮件-->
    <!--li-->
    <!--nuxt-link(to='/admin/unsolved?page=1') 未解决邮件-->
    <!--li-->
    <!--nuxt-link(to='/admin/solved?page=1') 已解决邮件-->

</template>
<script>
  export default {
    data () {
      return {
        isCollapse: true
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
<style lang='sass'>
  .el-menu-vertical-demo
    min-width: 71px
</style>

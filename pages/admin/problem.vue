<template lang="pug">
  .content
    .related-products
      table.table
        thead
          tr
            th 头像
            th 用户昵称
            th 问题类型
            th 问题内容
            th 是否回信
            th 满意度
        tbody
          tr(v-for='item in problems')
            td
              .img
                img(:src='item.user.avatarUrl')
            td {{item.user.nickname}}
            td {{item.problemType}}
            td {{item.problem}}
            td( v-text='item.solve ? "已回信": "未回信"')
            td( v-text='item.solve ? item.reply.isUserAccess ? item.satisfaction ? "满意": "不满意" : "待评价" : "待评价"')
</template>

<script>
  import { mapState } from 'vuex'
  import axios from 'axios'
  import vSnackbar from '~components/snackbar'

  export default {
    middleware: 'auth',
    layout: 'admin',
    head () {
      return {
        title: '问题列表'
      }
    },
    data () {
      return {
        isProduct: false,
        openSnackbar: false,
        editing: false
      }
    },
    async created () {
      this.$store.dispatch('fetchProblems')
    },
    computed: mapState([
      'problems'
    ]),
    methods: {

    },
    components: {
      vSnackbar
    }
  }
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>

<template lang="pug">
  .content
    .related-products
      table.table
        thead
          tr
            th 头像
            th openId
            th 用户昵称
            th 邮件类型
            th 邮件信息
            th 邮件回信
            th 回信管理员
            th 操作
        tbody
          tr(v-for='item in problemReply', v-if="item.problem.solve")
            td
              .img
                img(:src='item.problem.user.avatarUrl')
            td {{item.problem.user.openid}}
            td {{item.problem.user.nickname}}
            td {{item.problem.problem}}
            td {{item.problem.problemType}}
            td {{item.reply}}
            td {{item.adminUser.nickname}}{{item.adminUser.email}}
            td
              button.btn(@click='eidtDelete(item)', style="margin: 0 auto;")
                .material-icon(style='font-size: 20px') 删除
    v-snackbar(:open.sync='openSnackbar')
      span(slot='body') 删除成功
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
        title: '已解决问题'
      }
    },
    data () {
      return {
        openSnackbar: false,
        edited: {

        }
      }
    },
    async created () {
      this.$store.dispatch('fetchProblemReply')
    },
    mounted () {
      //待写
    },
    computed: mapState([
      'problemReply',
      'user'
    ]),
    methods: {
      async eidtDelete (item) {
        const result = await this.$store.dispatch('deleteReply', item._id)
        if(result.success){
          this.openSnackbar = true;
        }
      }
    },
    components: {
      vSnackbar
    }
  }
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>

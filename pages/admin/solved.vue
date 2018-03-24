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
          tr(v-for='item in problemReply.data', v-if="item.problem.solve")
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
    .pagination
      li
        a(v-on:click="pagination('prev')") «
      li(v-for="(n, index) in problemReply.count")
        a(v-on:click="pagination(index)") {{ index+1 }}
      li
        a(v-on:click="pagination('next')") »
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

        },
        activePage: 1
      }
    },
    async created () {
      this.activePage = Number(this.$route.query.page)
      await this.$store.dispatch('fetchProblemReply', this.activePage)
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
      },
      async pagination (num) {
        if (Number(num)) {
          num = Number(num)
          this.$router.push({path: '/admin/solved?page=' + num})
          this.$store.dispatch('fetchProblemReply', num)
        } else {
          if (this.activePage != 1 && num == 'prev'){

            this.activePage = this.activePage - 1
            this.$router.push({path: '/admin/solved?page=' + this.activePage})
            this.$store.dispatch('fetchProblemReply', this.activePage)
            console.log('prev')
          }
          else if (this.activePage < this.$store.state.problems.count.length && num == 'next') {
            this.activePage = this.activePage + 1
            this.$router.push({path: '/admin/solved?page=' + this.activePage})
            this.$store.dispatch('fetchProblemReply', this.activePage)
            console.log('next')

          }
        }
      }
    },
    components: {
      vSnackbar
    }
  }
</script>
<style>
  .pagination {
    display: inline-block;
    padding-left: 0;
    margin: 20px 0;
    border-radius: 4px;
  }
  .pagination>li {
    display: inline;
  }
  .pagination>li:first-child>a, .pagination>li:first-child>span {
    margin-left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .pagination>li:last-child>a, .pagination>li:last-child>span {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .pagination>li>a, .pagination>li>span {
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #ddd;
  }
</style>
<style lang='sass', src='~static/sass/admin.sass', scoped/>

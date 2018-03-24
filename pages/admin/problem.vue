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
          tr(v-for='item in problems.data')
            td
              .img
                img(:src='item.user.avatarUrl')
            td {{item.user.nickname}}
            td {{item.problemType}}
            td {{item.problem}}
            td( v-text='item.solve ? "已回信": "未回信"')
            td( v-text='item.solve ? item.reply.isUserAccess ? item.satisfaction ? "满意": "不满意" : "待评价" : "待评价"')
    .pagination
      li
        a(v-on:click="pagination('prev')") «
      li(v-for="(n, index) in problems.count")
        a(v-on:click="pagination(index)") {{ index+1 }}
      li
        a(v-on:click="pagination('next')") »
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
        editing: false,
        activePage: 1
      }
    },
    async created () {
      this.activePage = Number(this.$route.query.page)
      await this.$store.dispatch('fetchProblems', this.activePage)
    },
    computed: mapState([
      'problems'
    ]),
    methods: {
      async pagination (num) {
        if (Number(num)) {
          num = Number(num)
          this.activePage = num
          this.$router.push({path: '/admin/problem?page=' + num})
          this.$store.dispatch('fetchProblems', num)
        } else {
          if (this.activePage != 1 && num == 'prev'){
            this.activePage = this.activePage - 1
            this.$router.push({path: '/admin/problem?page=' + this.activePage})
            this.$store.dispatch('fetchProblems', this.activePage)
            console.log('prev')
          }
          else if (this.activePage < this.$store.state.problems.count.length && num == 'next') {
            this.activePage = this.activePage + 1
            this.$router.push({path: '/admin/problem?page=' + this.activePage})
            this.$store.dispatch('fetchProblems', this.activePage)
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

<template lang="pug">
  .content
    el-table(:data='problems.data', style='width: 100%', max-height='600')
      el-table-column( label='头像', width='180')
        template(slot-scope='scope')
          .img
            img(:src='scope.row.user.avatarUrl')
      el-table-column(prop='user.nickname', label='昵称', width='180')
      el-table-column(prop='problemType', label='问题类型', width='180')
      el-table-column(prop='problem', label='问题内容', width='180')
      el-table-column(label='是否回信', width='180')
        template(slot-scope='scope')
          | {{ scope.row.solve ? "已回信": "未回信" }}
      el-table-column(label='是否回信', width='180')
        template(slot-scope='scope')
          | {{ scope.row.solve ? scope.row.reply.isUserAccess ? scope.row.satisfaction ? "满意": "不满意" : "待评价" : "待评价" }}
      el-table-column(label='创建日期', width='180')
        template(slot-scope='scope')
          | {{ scope.row.meta.createdAt | momentDate }}
    //    分页
    el-pagination(background='', layout='prev, pager, next', :total='problems.count', @current-change="handleCurrentChange")
</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'

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
        activePage: 1,
        currentPage4: 4
      }
    },
    filters: {
      momentDate (time) {
        return moment(time).format("YYYY-DD-MM hh:mm:ss")
      }
    },
    async created () {
      this.activePage = Number(this.$route.query.page)
      await this.$store.dispatch('fetchProblems', this.activePage)
      console.log(this.problem)
    },
    computed: mapState([
      'problems'
    ]),
    methods: {
    //  分页
      async handleCurrentChange(val) {
        await this.$store.dispatch('fetchProblems', val)
        this.$router.push({path: '/admin/problem?page=' + val})
      }
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

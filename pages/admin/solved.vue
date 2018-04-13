<template lang="pug">
  .content
    el-table(:data='problemReply.data', style='width: 100%', max-height='600')
      el-table-column( label='头像', width='180')
        template(slot-scope='scope')
          .img
            img(:src='scope.row.problem.user.avatarUrl')
      el-table-column(prop='problem.user.nickname', label='昵称', width='180')
      el-table-column(prop='problem.problemType', label='来信类型', width='180')
      el-table-column(prop='problem.problem', label='来信内容', width='180')
      el-table-column(label='创建日期', width='180')
        template(slot-scope='scope')
          | {{ scope.row.meta.createdAt | momentDate }}
      el-table-column(label='回复用时', width='180')
        template(slot-scope='scope')
          | {{ scope.row.meta.createdAt,scope.row.problem.meta.createdAt | difference }}
      el-table-column(prop='reply', label='信件回复', width='180')
      el-table-column(prop='adminUser.nickname', label='回信管理员', width='180')
    //    分页
    el-pagination(background='', layout='prev, pager, next', :total='problemReply.count.length', @current-change="handleCurrentChange")
</template>
<script>
  import { mapState } from 'vuex'
  import moment from 'moment'

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
    // 日期过滤
    filters: {
      momentDate (time) {
        return moment(time).format("YYYY-DD-MM hh:mm:ss")
      },
      difference (replyTime, problemTime) {
        return moment(problemTime).from(replyTime)
      }
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

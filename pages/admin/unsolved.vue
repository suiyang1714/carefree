<template lang="pug">
  .content
    el-table(:data='unsolvedproblems.data', style='width: 100%', max-height='600')
      el-table-column( label='头像', width='180')
        template(slot-scope='scope')
          .img
            img(:src='scope.row.user.avatarUrl')
      el-table-column(prop='user.nickname', label='昵称', width='180')
      el-table-column(prop='problemType', label='问题类型', width='180')
      el-table-column(prop='problem', label='问题内容', width='180')
      el-table-column(label='创建日期', width='180')
        template(slot-scope='scope')
          | {{ scope.row.meta.createdAt | difference }}
      el-table-column(label='距今时间', width='180')
        template(slot-scope='scope')
          | {{ scope.row.meta.createdAt | momentDate }}
      el-table-column(fixed='right', label='操作', width='60')
        template(slot-scope='scope')
          el-button(@click.native.prevent='createUser(scope.$index, unsolvedproblems.data)', type='text', size='small')
            | 回信
    //    分页
    el-pagination(background='', layout='prev, pager, next', :total='unsolvedproblems.count', @current-change="handleCurrentChange")
    .edit-product(:class='{active: editing}')
      el-form(ref='form', :model='form', label-width='80px')
        h1  创建新回信
        el-form-item(label='id')
          el-input(v-model='form._id')
        el-form-item(label='管理员邮箱')
          el-input(v-model='user.email')
        el-form-item(label='用户昵称')
          el-input(v-model='form.user.nickname')
        el-form-item(label='回复内容')
          el-input(type='textarea', v-model='form.reply', @keyup='editedIntro')
        el-form-item
          el-button(type='primary', @click='saveEdited', v-if='!isProduct') 创建新回信
          el-button(@click='editing = !editing') 取消
    <!--.float-btn(@click='createUser')-->
      <!--el-button(type='primary', icon='el-icon-edit', circle='')-->

</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'

  export default {
    middleware: 'auth',
    layout: 'admin',
    head () {
      return {
        title: '未解决问题列表'
      }
    },
    data () {
      return {
        isProduct: false,
        openSnackbar: false,
        form: {
          _id: '',
          user: {
            nickname: ''
          }
        },
        editing: false,
        activePage: 1,
        rowObject: Object,
        rowIndex: Number
      }
    },
    async created () {
      this.activePage = Number(this.$route.query.page)
      await this.$store.dispatch('fetchUnsolvedProblems', this.activePage)
    },
    // 日期过滤
    filters: {
      momentDate (time) {
        return moment(time).format("YYYY-DD-MM hh:mm:ss")
      },
      difference (time) {
        return moment(time).fromNow()
        // return moment(moment(time).format("YYYY-DD-MM hh:mm:ss"),"YYYY-DD-MM hh:mm:ss").fromNow()
      }
    },
    mounted () {
      //待写
    },
    computed: mapState([
      'unsolvedproblems',
      'user'
    ]),
    methods: {
      editedIntro (e) {
        let html = e.target.value
        html = html.replace(/\n/g, '<br/>')
        this.edited.intro = html
      },
      eidtReply (item) {
        this.form = item
        this.isProduct = true
        this.editing = true
      },
      createUser (index, rows) {
        this.form = rows[index]
        this.isProduct = false
        this.editing = true
        this.rowObject = rows
        this.rowIndex = index
      },
      async saveEdited () {
        this.isProduct = false
        this.editing = !this.editing
        const resolve = await this.$store.dispatch('addReply', this.form)
        if (resolve.success) {

          this.rowObject.splice(this.rowIndex, 1)
          // 弹框
          const h = this.$createElement;
          this.$notify({
            title: '回复成功',
            message: h('i', { style: 'color: teal'}, `您以${this.$store.state.user.nickname}名义回复成功`),
            duration: 3000
          });
        } else {
          // 弹框
          const h = this.$createElement;
          this.$notify({
            title: '回复失败',
            message: h('i', { style: 'color: teal'}, '请向开发者反馈该问题'),
            duration: 3000
          });

        }
      },
      //  分页
      async handleCurrentChange(val) {
        await this.$store.dispatch('fetchUnsolvedProblems', val)
        this.$router.push({path: '/admin/unsolved?page=' + val})
      }
    }
  }
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .edit-product {
    width: auto;
    height: auto;
    padding: 5%;
  }
</style>
